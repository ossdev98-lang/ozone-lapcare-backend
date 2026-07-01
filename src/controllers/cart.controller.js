const { Cart, CartItem, Product, ProductImage, Coupon, Setting } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images', where: { isPrimary: true }, required: false, limit: 1 }] }] }] });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
};

const calcCartTotals = (items, freeShippingThreshold = 999, shippingCharge = 99, discount = 0) => {
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  // Product prices are GST-inclusive (18%), extract GST from total
  const taxableInclusive = subtotal - discount;
  const baseAmount = taxableInclusive / (1 + 0.18);
  const tax = taxableInclusive - baseAmount;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCharge;
  // Total is taxableInclusive (items + GST after discount) + shipping
  const total = taxableInclusive + shipping;
  return { subtotal: +subtotal.toFixed(2), tax: +tax.toFixed(2), shipping, total: +total.toFixed(2), freeShippingThreshold, discount };
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    let freeShippingThreshold = 999;
    let shippingCharge = 99;
    let discount = 0;
    try {
      const thresholdSetting = await Setting.findByPk('freeShippingThreshold');
      if (thresholdSetting) freeShippingThreshold = parseFloat(thresholdSetting.value) || 999;
      const chargeSetting = await Setting.findByPk('shippingCharge');
      if (chargeSetting) shippingCharge = parseFloat(chargeSetting.value) || 99;
    } catch {}
    if (cart.couponId) {
      const coupon = await Coupon.findByPk(cart.couponId);
      if (coupon) {
        const couponValue = toNumber(coupon.value);
        const maxDiscount = coupon.maxDiscount == null ? null : toNumber(coupon.maxDiscount);
        discount = coupon.type === 'percentage' ? (cart.items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) * couponValue) / 100 : couponValue;
        if (maxDiscount !== null) discount = Math.min(discount, maxDiscount);
      }
    }
    const totals = calcCartTotals(cart.items || [], freeShippingThreshold, shippingCharge, discount);
    return success(res, { ...cart.toJSON(), ...totals });
  } catch (err) { return error(res, err.message); }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || product.status !== 'active') return error(res, 'Product not available', 404);
    if (product.stock < quantity) return error(res, 'Insufficient stock', 400);
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) cart = await Cart.create({ userId: req.user.id });
    const existing = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (existing) {
      const newQty = existing.quantity + parseInt(quantity);
      if (product.stock < newQty) return error(res, 'Insufficient stock', 400);
      await existing.update({ quantity: newQty });
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity, price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price });
    }
    return success(res, null, 'Added to cart');
  } catch (err) { return error(res, err.message); }
};

exports.updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.itemId }, include: [{ model: Cart, required: true, where: { userId: req.user.id } }] });
    if (!item) return error(res, 'Cart item not found', 404);
    const product = await Product.findByPk(item.productId);
    if (product.stock < req.body.quantity) return error(res, 'Insufficient stock', 400);
    await item.update({ quantity: req.body.quantity });
    return success(res, null, 'Cart updated');
  } catch (err) { return error(res, err.message); }
};

exports.removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return error(res, 'Item not found', 404);
    await item.destroy();
    return success(res, null, 'Removed from cart');
  } catch (err) { return error(res, err.message); }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) await CartItem.destroy({ where: { cartId: cart.id } });
    return success(res, null, 'Cart cleared');
  } catch (err) { return error(res, err.message); }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), isActive: true } });
    if (!coupon) return error(res, 'Invalid coupon code', 404);
    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) return error(res, 'Coupon expired', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return error(res, 'Coupon usage limit reached', 400);
    const cart = await Cart.findOne({ where: { userId: req.user.id }, include: [{ model: CartItem, as: 'items' }] });
    const subtotal = cart.items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
    const couponValue = toNumber(coupon.value);
    const minOrderAmount = toNumber(coupon.minOrderAmount);
    const maxDiscount = coupon.maxDiscount == null ? null : toNumber(coupon.maxDiscount);
    if (subtotal < minOrderAmount) return error(res, `Minimum order amount Rs.${minOrderAmount} required`, 400);
    let discount = coupon.type === 'percentage' ? (subtotal * couponValue) / 100 : couponValue;
    if (maxDiscount !== null) discount = Math.min(discount, maxDiscount);
    await cart.update({ couponId: coupon.id });
    return success(res, { discount: +discount.toFixed(2), coupon: { code: coupon.code, type: coupon.type, value: couponValue } }, 'Coupon applied');
  } catch (err) { return error(res, err.message); }
};

exports.removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) await cart.update({ couponId: null });
    return success(res, null, 'Coupon removed');
  } catch (err) { return error(res, err.message); }
};
