const crypto = require('crypto');
const { User, sequelize } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail, emailTemplates } = require('../utils/email');
const { success, error } = require('../utils/response');

const handleError = (res, err) => error(res, err.publicMessage || err.message, err.statusCode || 500);
const generateEmailOtp = () => crypto.randomInt(100000, 1000000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return error(res, 'Email already registered', 409);

    const otp = generateEmailOtp();

    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await User.create({ name, email, phone, password, emailVerifyToken: otp }, { transaction });
      await sendEmail({ to: email, subject: 'Verify your email - Ozone Lapcare', html: emailTemplates.verifyEmail(name, otp) });
      return newUser;
    });

    return success(res, { id: user.id, name, email }, 'Registration successful. Please verify your email.', 201);
  } catch (err) {
    return handleError(res, err);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token || req.body.token || req.body.otp;
    const email = req.body.email || req.query.email;

    if (!token) return error(res, 'Verification code is required', 400);

    const where = email ? { email, emailVerifyToken: token } : { emailVerifyToken: token };
    const user = await User.findOne({ where });
    if (!user) return error(res, 'Invalid verification code', 400);

    await user.update({ isEmailVerified: true, emailVerifyToken: null });
    return success(res, null, 'Email verified successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await user.comparePassword(password)) return error(res, 'Invalid credentials', 401);
    if (!user.isEmailVerified) return error(res, 'Please verify your email first', 403);
    if (user.status !== 'active') return error(res, 'Account is disabled', 403);
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await user.update({ refreshToken });
    return success(res, {
      accessToken, refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    }, 'Login successful');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 401);
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findOne({ where: { id: decoded.id, refreshToken } });
    if (!user) return error(res, 'Invalid refresh token', 401);
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });
    await user.update({ refreshToken: newRefreshToken });
    return success(res, { accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return error(res, 'Invalid or expired refresh token', 401);
  }
};

exports.logout = async (req, res) => {
  try {
    await req.user.update({ refreshToken: null });
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return success(res, null, 'If email exists, reset link has been sent');
    const token = crypto.randomBytes(32).toString('hex');
    await user.update({ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 });
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail({ to: email, subject: 'Reset Password - Ozone Lapcare', html: emailTemplates.resetPassword(user.name, url) });
    return success(res, null, 'Password reset link sent to your email');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user || user.resetPasswordExpires < Date.now()) return error(res, 'Invalid or expired token', 400);
    await user.update({ password, resetPasswordToken: null, resetPasswordExpires: null });
    return success(res, null, 'Password reset successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getMe = async (req, res) => success(res, req.user);

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await req.user.update({ name, phone });
    return success(res, req.user, 'Profile updated');
  } catch (err) {
    return handleError(res, err);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!await user.comparePassword(currentPassword)) return error(res, 'Current password is incorrect', 400);
    await user.update({ password: newPassword });
    return success(res, null, 'Password changed successfully');
  } catch (err) {
    return handleError(res, err);
  }
};
