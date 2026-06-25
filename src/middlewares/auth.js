const { verifyAccessToken } = require('../utils/jwt');
const { error } = require('../utils/response');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return error(res, 'No token provided', 401);
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password', 'refreshToken'] } });
    if (!user || user.status !== 'active') return error(res, 'Unauthorized', 401);
    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return error(res, 'Forbidden: insufficient permissions', 403);
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password', 'refreshToken'] } });
    }
  } catch {}
  next();
};

module.exports = { authenticate, authorize, optionalAuth };
