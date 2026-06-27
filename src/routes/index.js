const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const misc = require('../controllers/misc.controller');
const cartCtrl = require('../controllers/cart.controller');
const orderCtrl = require('../controllers/order.controller');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

// Categories
router.get('/categories', ctrl.getCategories);
router.get('/categories/:slug', ctrl.getCategory);
router.post('/categories', authenticate, authorize('ADMIN'), upload.single('image'), ctrl.createCategory);
router.put('/categories/:id', authenticate, authorize('ADMIN'), upload.single('image'), ctrl.updateCategory);
router.delete('/categories/:id', authenticate, authorize('ADMIN'), ctrl.deleteCategory);

// Brands
router.get('/brands', ctrl.getBrands);
router.get('/brands/:slug', ctrl.getBrand);
router.post('/brands', authenticate, authorize('ADMIN'), upload.single('logo'), ctrl.createBrand);
router.put('/brands/:id', authenticate, authorize('ADMIN'), upload.single('logo'), ctrl.updateBrand);
router.delete('/brands/:id', authenticate, authorize('ADMIN'), ctrl.deleteBrand);

// Cart
router.get('/cart', authenticate, cartCtrl.getCart);
router.post('/cart', authenticate, cartCtrl.addToCart);
router.put('/cart/:itemId', authenticate, cartCtrl.updateCartItem);
router.delete('/cart/:itemId', authenticate, cartCtrl.removeFromCart);
router.delete('/cart', authenticate, cartCtrl.clearCart);
router.post('/cart/coupon', authenticate, cartCtrl.applyCoupon);
router.delete('/cart/coupon', authenticate, cartCtrl.removeCoupon);

// Orders
router.post('/orders', authenticate, orderCtrl.createOrder);
router.post('/orders/verify-payment', authenticate, orderCtrl.verifyPayment);
router.get('/orders', authenticate, orderCtrl.getMyOrders);
router.get('/orders/:id', authenticate, orderCtrl.getOrder);
router.put('/orders/:id/cancel', authenticate, orderCtrl.cancelOrder);

// Admin Orders
router.get('/admin/orders', authenticate, authorize('ADMIN'), orderCtrl.getAllOrders);
router.put('/admin/orders/:id/status', authenticate, authorize('ADMIN'), orderCtrl.updateOrderStatus);

// Reviews
router.post('/reviews', authenticate, misc.createReview);
router.get('/reviews/:productId', misc.getProductReviews);
router.get('/admin/reviews', authenticate, authorize('ADMIN'), misc.getAllReviews);
router.put('/admin/reviews/:id', authenticate, authorize('ADMIN'), misc.updateReview);

// Wishlist
router.get('/wishlist', authenticate, misc.getWishlist);
router.post('/wishlist', authenticate, misc.toggleWishlist);

// Addresses
router.get('/addresses', authenticate, misc.getAddresses);
router.post('/addresses', authenticate, misc.createAddress);
router.put('/addresses/:id', authenticate, misc.updateAddress);
router.delete('/addresses/:id', authenticate, misc.deleteAddress);

// Coupons
router.post('/coupons/validate', authenticate, misc.validateCoupon);
router.get('/admin/coupons', authenticate, authorize('ADMIN'), misc.getCoupons);
router.post('/admin/coupons', authenticate, authorize('ADMIN'), misc.createCoupon);
router.put('/admin/coupons/:id', authenticate, authorize('ADMIN'), misc.updateCoupon);
router.delete('/admin/coupons/:id', authenticate, authorize('ADMIN'), misc.deleteCoupon);

// Repair Services
router.get('/repair-services', misc.getRepairServices);
router.post('/repair-bookings', optionalAuth, misc.createRepairBooking);
router.get('/repair-bookings/my', authenticate, misc.getMyRepairBookings);
router.get('/admin/repair-bookings', authenticate, authorize('ADMIN'), misc.getAllRepairBookings);
router.put('/admin/repair-bookings/:id', authenticate, authorize('ADMIN'), misc.updateRepairBooking);

// Offers
router.get('/offers', misc.getOffers);
router.get('/admin/offers', authenticate, authorize('ADMIN'), misc.getAllOffers);
router.post('/admin/offers', authenticate, authorize('ADMIN'), misc.createOffer);
router.put('/admin/offers/:id', authenticate, authorize('ADMIN'), misc.updateOffer);
router.delete('/admin/offers/:id', authenticate, authorize('ADMIN'), misc.deleteOffer);

// Notifications
router.get('/notifications', authenticate, misc.getNotifications);
router.put('/notifications/:id/read', authenticate, misc.markNotificationRead);

// Admin Dashboard
router.get('/admin/dashboard', authenticate, authorize('ADMIN'), misc.getDashboardStats);
router.get('/admin/users', authenticate, authorize('ADMIN'), misc.getUsers);
router.put('/admin/users/:id/status', authenticate, authorize('ADMIN'), misc.updateUserStatus);
router.post('/admin/whatsapp/broadcast', authenticate, authorize('ADMIN'), misc.sendWhatsappBroadcast);
router.get('/admin/whatsapp/broadcast-types', authenticate, authorize('ADMIN'), misc.getBroadcastTypes);

module.exports = router;
