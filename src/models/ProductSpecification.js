'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductSpecification = sequelize.define('ProductSpecification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    groupName: { type: DataTypes.STRING },
    key: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
  ProductSpecification.associate = (models) => {
    ProductSpecification.belongsTo(models.Product, { foreignKey: 'productId' });
  };
  return ProductSpecification;
};
