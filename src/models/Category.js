'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING },
    parentId: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'id' } },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    metaTitle: { type: DataTypes.STRING },
    metaDescription: { type: DataTypes.TEXT },
  });
  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
    Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
  };
  return Category;
};
