const { Order, OrderItem, Cart, CartItem, Product, Address, Coupon, User, Notification, Setting } = require('../models');
const { success, error, paginate } = require('../utils/response');
const { generateOrderNumber } = require('../utils/helpers');
const { sendEmail, emailTemplates } = require('../utils/email');
const { sendOrderPlaced, sendOrderStatus, sendPaymentConfirmed } = require('../utils/whatsapp');
const crypto = require('crypto');

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

exports.createOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();
  try {
    const { addressId, paymentMethod = 'cod', notes } = req.body;
    const cart = await Cart.findOne({ where: { userId: req.user.id }, include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }, { model: Coupon, as: 'coupon' }] });
    if (!cart || !cart.items.length) return error(res, 'Cart is empty', 400);
    const address = await Address.findOne({ where: { id: addressId, userId: req.user.id } });
    if (!address) return error(res, 'Address not found', 404);
    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) { await t.rollback(); return error(res, `${item.product.name} out of stock`, 400); }
    }
    const subtotal = cart.items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
    const freeShippingThreshold = parseFloat((await Setting.findByPk('freeShippingThreshold'))?.value) || 999;
    const shippingChargeValue = parseFloat((await Setting.findByPk('shippingCharge'))?.value) || 99;
    let discount = 0;
    if (cart.coupon) {
      const couponValue = toNumber(cart.coupon.value);
      const maxDiscount = cart.coupon.maxDiscount == null ? null : toNumber(cart.coupon.maxDiscount);
      discount = cart.coupon.type === 'percentage' ? (subtotal * couponValue) / 100 : couponValue;
      if (maxDiscount !== null) discount = Math.min(discount, maxDiscount);
    }
    const taxAmount = (subtotal - discount) * 0.18;
    const shippingCharge = subtotal >= freeShippingThreshold ? 0 : shippingChargeValue;
    const total = subtotal - discount + taxAmount + shippingCharge;
    const order = await Order.create({
      orderNumber: generateOrderNumber(), userId: req.user.id, addressId, paymentMethod,
      status: 'pending', subtotal: +subtotal.toFixed(2), discount: +discount.toFixed(2),
      taxAmount: +taxAmount.toFixed(2), shippingCharge, total: +total.toFixed(2),
      couponCode: cart.coupon?.code, couponDiscount: +discount.toFixed(2),
      shippingAddress: { name: address.name, phone: address.phone, line1: address.line1, line2: address.line2, city: address.city, state: address.state, pincode: address.pincode },
      notes,
    }, { transaction: t });
    const orderItems = cart.items.map(i => ({
      orderId: order.id, productId: i.productId, productName: i.product.name, productSku: i.product.sku,
      productImage: i.product.thumbnail, price: i.price, quantity: i.quantity, total: +(parseFloat(i.price) * i.quantity).toFixed(2),
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });
    // Update stock and totalSold
    for (const item of cart.items) {
      await item.product.decrement('stock', { by: item.quantity, transaction: t });
      await item.product.increment('totalSold', { by: item.quantity, transaction: t });
    }
    // Update coupon usage
    if (cart.coupon) await cart.coupon.increment('usedCount', { transaction: t });
    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
    await cart.update({ couponId: null }, { transaction: t });
    await t.commit();
    // For Razorpay, create a Razorpay order and return its id
    if (paymentMethod === 'razorpay') {
      const Razorpay = require('razorpay');
      const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const rzpOrder = await rzp.orders.create({ amount: Math.round(total * 100), currency: 'INR', receipt: `order_${order.id}` });
      await order.update({ razorpayOrderId: rzpOrder.id });
    // Notifications, email & WhatsApp
    await Notification.create({ userId: req.user.id, title: 'Order Placed', message: `Your order #${order.orderNumber} has been placed`, type: 'order', link: `/orders/${order.id}` });
    await sendEmail({ to: req.user.email, subject: `Order Confirmed #${order.orderNumber}`, html: emailTemplates.orderConfirmation(req.user.name, order.orderNumber, total.toFixed(2)) });
      return success(res, { ...order.toJSON(), razorpayOrderId: rzpOrder.id, razorpayAmount: rzpOrder.amount }, 'Order created', 201);
    }
    // Notifications, email & WhatsApp
    await Notification.create({ userId: req.user.id, title: 'Order Placed', message: `Your order #${order.orderNumber} has been placed`, type: 'order', link: `/orders/${order.id}` });
    await sendEmail({ to: req.user.email, subject: `Order Confirmed #${order.orderNumber}`, html: emailTemplates.orderConfirmation(req.user.name, order.orderNumber, total.toFixed(2)) });
    sendOrderPlaced(req.user.phone, req.user.name, order.orderNumber, total.toFixed(2));
    return success(res, order, 'Order placed successfully', 201);
  } catch (err) {
    await t.rollback();
    return error(res, err.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const { count, rows } = await Order.findAndCountAll({
      where, include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return paginate(res, rows, count, page, limit);
  } catch (err) { return error(res, err.message); }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: OrderItem, as: 'items' }] });
    if (!order) return error(res, 'Order not found', 404);
    return success(res, order);
  } catch (err) { return error(res, err.message); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return error(res, 'Order not found', 404);
    if (!['pending', 'confirmed'].includes(order.status)) return error(res, 'Order cannot be cancelled', 400);
    await order.update({ status: 'cancelled', cancelledAt: new Date(), cancelReason: req.body.reason });
    return success(res, null, 'Order cancelled');
  } catch (err) { return error(res, err.message); }
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    const { count, rows } = await Order.findAndCountAll({
      where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }, { model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit), distinct: true,
    });
    return paginate(res, rows, count, page, limit);
  } catch (err) { return error(res, err.message); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: User, as: 'user' }] });
    if (!order) return error(res, 'Order not found', 404);
    await order.update({ status: req.body.status, trackingNumber: req.body.trackingNumber, ...(req.body.status === 'delivered' && { deliveredAt: new Date() }) });
    await Notification.create({ userId: order.userId, title: 'Order Updated', message: `Your order #${order.orderNumber} is now ${req.body.status}`, type: 'order', link: `/orders/${order.id}` });
    if (order.user?.phone) sendOrderStatus(order.user.phone, order.user.name, order.orderNumber, req.body.status, req.body.trackingNumber, order.total);
    return success(res, order, 'Order status updated');
  } catch (err) { return error(res, err.message); }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
    if (expected !== razorpaySignature) return error(res, 'Payment verification failed', 400);
    const order = await Order.findOne({ where: { id: orderId, userId: req.user.id } });
    if (!order) return error(res, 'Order not found', 404);
    await order.update({ paymentStatus: 'paid', paymentId: razorpayPaymentId, status: 'confirmed' });
    const user = await User.findByPk(order.userId);
    if (user?.phone) sendPaymentConfirmed(user.phone, user.name, order.orderNumber, order.total);
    return success(res, null, 'Payment verified successfully');
  } catch (err) { return error(res, err.message); }
};
