'use strict';
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('ADMIN', 'CUSTOMER'), defaultValue: 'CUSTOMER' },
    status: { type: DataTypes.ENUM('active', 'inactive', 'banned'), defaultValue: 'active' },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    emailVerifyToken: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpires: { type: DataTypes.DATE },
    refreshToken: { type: DataTypes.TEXT },
    avatar: { type: DataTypes.STRING },
    googleId: { type: DataTypes.STRING },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) user.password = await bcrypt.hash(user.password, 12);
      },
    },
  });

  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses' });
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
    User.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart' });
    User.hasMany(models.Wishlist, { foreignKey: 'userId', as: 'wishlist' });
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
  };
  return User;
};
