'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('ProductImage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    publicId: { type: DataTypes.STRING },
    altText: { type: DataTypes.STRING },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
  };
  return ProductImage;
};
