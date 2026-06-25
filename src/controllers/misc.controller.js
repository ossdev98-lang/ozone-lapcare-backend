const { Review, Product, Wishlist, Address, Coupon, RepairService, RepairBooking, User, Order, OrderItem } = require('../models');
const { success, error, paginate } = require('../utils/response');
const { Op, fn, col, literal } = require('sequelize');

// Reviews
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body;
    const exists = await Review.findOne({ where: { productId, userId: req.user.id } });
    if (exists) return error(res, 'Already reviewed this product', 409);
    const review = await Review.create({ productId, userId: req.user.id, rating, title, body });
    const allReviews = await Review.findAll({ where: { productId } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Product.update({ avgRating: avg.toFixed(1), totalReviews: allReviews.length }, { where: { id: productId } });
    return success(res, review, 'Review submitted', 201);
  } catch (err) { return error(res, err.message); }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows } = await Review.findAndCountAll({
      where: { productId: req.params.productId, isApproved: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return paginate(res, rows, count, page, limit);
  } catch (err) { return error(res, err.message); }
};

// Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product' }] });
    return success(res, items);
  } catch (err) { return error(res, err.message); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const exists = await Wishlist.findOne({ where: { userId: req.user.id, productId } });
    if (exists) { await exists.destroy(); return success(res, { added: false }, 'Removed from wishlist'); }
    await Wishlist.create({ userId: req.user.id, productId });
    return success(res, { added: true }, 'Added to wishlist');
  } catch (err) { return error(res, err.message); }
};

// Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addrs = await Address.findAll({ where: { userId: req.user.id } });
    return success(res, addrs);
  } catch (err) { return error(res, err.message); }
};

exports.createAddress = async (req, res) => {
  try {
    if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    const addr = await Address.create({ ...req.body, userId: req.user.id });
    return success(res, addr, 'Address added', 201);
  } catch (err) { return error(res, err.message); }
};

exports.updateAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return error(res, 'Address not found', 404);
    if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    await addr.update(req.body);
    return success(res, addr, 'Address updated');
  } catch (err) { return error(res, err.message); }
};

exports.deleteAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return error(res, 'Address not found', 404);
    await addr.destroy();
    return success(res, null, 'Address deleted');
  } catch (err) { return error(res, err.message); }
};

// Coupons
exports.validateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ where: { code: req.body.code.toUpperCase(), isActive: true } });
    if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) return error(res, 'Invalid or expired coupon', 404);
    return success(res, coupon);
  } catch (err) { return error(res, err.message); }
};

exports.getCoupons = async (req, res) => {
  try { return success(res, await Coupon.findAll()); } catch (err) { return error(res, err.message); }
};
exports.createCoupon = async (req, res) => {
  try { return success(res, await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() }), 'Coupon created', 201); } catch (err) { return error(res, err.message); }
};
exports.updateCoupon = async (req, res) => {
  try {
    const c = await Coupon.findByPk(req.params.id);
    if (!c) return error(res, 'Coupon not found', 404);
    await c.update(req.body);
    return success(res, c);
  } catch (err) { return error(res, err.message); }
};
exports.deleteCoupon = async (req, res) => {
  try { await Coupon.destroy({ where: { id: req.params.id } }); return success(res, null, 'Coupon deleted'); } catch (err) { return error(res, err.message); }
};

// Repair
exports.getRepairServices = async (req, res) => {
  try { return success(res, await RepairService.findAll({ where: { isActive: true } })); } catch (err) { return error(res, err.message); }
};
exports.createRepairBooking = async (req, res) => {
  try {
    const booking = await RepairBooking.create({ ...req.body, userId: req.user?.id });
    return success(res, booking, 'Repair booking submitted', 201);
  } catch (err) { return error(res, err.message); }
};
exports.getMyRepairBookings = async (req, res) => {
  try {
    const bookings = await RepairBooking.findAll({ where: { userId: req.user.id }, include: [{ model: RepairService, as: 'service' }] });
    return success(res, bookings);
  } catch (err) { return error(res, err.message); }
};
exports.getAllRepairBookings = async (req, res) => {
  try { return success(res, await RepairBooking.findAll({ include: [{ model: RepairService, as: 'service' }], order: [['createdAt', 'DESC']] })); } catch (err) { return error(res, err.message); }
};
exports.updateRepairBooking = async (req, res) => {
  try {
    const booking = await RepairBooking.findByPk(req.params.id);
    if (!booking) return error(res, 'Booking not found', 404);
    await booking.update(req.body);
    return success(res, booking);
  } catch (err) { return error(res, err.message); }
};

exports.createRepairPaymentOrder = async (req, res) => {
  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const booking = await RepairBooking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return error(res, 'Booking not found', 404);
    if (!booking.confirmBookingAmount) return error(res, 'No booking amount set', 400);
    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(booking.confirmBookingAmount) * 100),
      currency: 'INR',
      receipt: `repair_${booking.id}`,
    });
    return success(res, { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) { return error(res, err.message); }
};

exports.verifyRepairPayment = async (req, res) => {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) return error(res, 'Payment verification failed', 400);
    const booking = await RepairBooking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return error(res, 'Booking not found', 404);
    await booking.update({ paymentId: razorpay_payment_id, paymentStatus: 'paid' });
    return success(res, null, 'Payment verified successfully');
  } catch (err) { return error(res, err.message); }
};

// Admin - Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalRevenue, totalOrders, totalProducts, totalCustomers, recentOrders, topProducts] = await Promise.all([
      Order.sum('total', { where: { status: 'delivered' } }),
      Order.count(),
      Product.count({ where: { status: 'active' } }),
      User.count({ where: { role: 'CUSTOMER' } }),
      Order.findAll({ include: [{ model: User, as: 'user', attributes: ['name', 'email'] }], order: [['createdAt', 'DESC']], limit: 5 }),
      Product.findAll({ order: [['totalSold', 'DESC']], limit: 5, attributes: ['id', 'name', 'totalSold', 'price', 'thumbnail'] }),
    ]);
    return success(res, { totalRevenue: totalRevenue || 0, totalOrders, totalProducts, totalCustomers, recentOrders, topProducts });
  } catch (err) { return error(res, err.message); }
};

// Admin - Users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { count, rows } = await User.findAndCountAll({ where: { role: 'CUSTOMER' }, attributes: { exclude: ['password', 'refreshToken'] }, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
    return paginate(res, rows, count, page, limit);
  } catch (err) { return error(res, err.message); }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    await user.update({ status: req.body.status });
    return success(res, null, 'User status updated');
  } catch (err) { return error(res, err.message); }
};

// Admin - Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: [{ model: User, as: 'user', attributes: ['name', 'email'] }, { model: Product, as: 'product', attributes: ['name'] }], order: [['createdAt', 'DESC']] });
    return success(res, reviews);
  } catch (err) { return error(res, err.message); }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return error(res, 'Review not found', 404);
    await review.update(req.body);
    return success(res, review);
  } catch (err) { return error(res, err.message); }
};

// Notifications
exports.getNotifications = async (req, res) => {
  try {
    const { Notification } = require('../models');
    const notifications = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit: 20 });
    return success(res, notifications);
  } catch (err) { return error(res, err.message); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { Notification } = require('../models');
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, ...(req.params.id !== 'all' && { id: req.params.id }) } });
    return success(res, null, 'Notifications marked as read');
  } catch (err) { return error(res, err.message); }
};
