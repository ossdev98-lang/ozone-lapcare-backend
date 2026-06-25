const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

router.post('/register', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })], validate, ctrl.register);
router.get('/verify-email', ctrl.verifyEmail);
router.post('/verify-email', [body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 }).isNumeric()], validate, ctrl.verifyEmail);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, ctrl.login);
router.post('/refresh-token', ctrl.refreshToken);
router.post('/logout', authenticate, ctrl.logout);
router.post('/forgot-password', body('email').isEmail(), validate, ctrl.forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 6 })], validate, ctrl.resetPassword);
router.get('/me', authenticate, ctrl.getMe);
router.put('/me', authenticate, ctrl.updateProfile);
router.put('/change-password', authenticate, ctrl.changePassword);

module.exports = router;
