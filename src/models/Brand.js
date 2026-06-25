'use strict';
module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    logo: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    website: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
  Brand.associate = (models) => {
    Brand.hasMany(models.Product, { foreignKey: 'brandId', as: 'products' });
  };
  return Brand;
};
