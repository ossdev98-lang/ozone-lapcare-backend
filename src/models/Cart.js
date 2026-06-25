'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, unique: true },
    sessionId: { type: DataTypes.STRING },
    couponId: { type: DataTypes.INTEGER },
  });
  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
    Cart.belongsTo(models.Coupon, { foreignKey: 'couponId', as: 'coupon' });
  };
  return Cart;
};
