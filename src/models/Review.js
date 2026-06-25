'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: true },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
  Review.associate = (models) => {
    Review.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Review;
};
