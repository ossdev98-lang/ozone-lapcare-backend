'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, validate: { min: 1 } },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  });
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
    CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };
  return CartItem;
};
