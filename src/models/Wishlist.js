'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  });
  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: 'userId' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };
  return Wishlist;
};
