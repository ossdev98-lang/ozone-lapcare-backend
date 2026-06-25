'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    shortDescription: { type: DataTypes.STRING },
    sku: { type: DataTypes.STRING, unique: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    comparePrice: { type: DataTypes.DECIMAL(10, 2) },
    costPrice: { type: DataTypes.DECIMAL(10, 2) },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    lowStockThreshold: { type: DataTypes.INTEGER, defaultValue: 5 },
    categoryId: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'id' } },
    brandId: { type: DataTypes.INTEGER, references: { model: 'Brands', key: 'id' } },
    condition: { type: DataTypes.ENUM('new', 'refurbished', 'used'), defaultValue: 'new' },
    status: { type: DataTypes.ENUM('active', 'inactive', 'draft'), defaultValue: 'active' },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isFlashSale: { type: DataTypes.BOOLEAN, defaultValue: false },
    flashSalePrice: { type: DataTypes.DECIMAL(10, 2) },
    flashSaleEnds: { type: DataTypes.DATE },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    weight: { type: DataTypes.FLOAT },
    thumbnail: { type: DataTypes.STRING },
    avgRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalSold: { type: DataTypes.INTEGER, defaultValue: 0 },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    gstPercent: { type: DataTypes.FLOAT, defaultValue: 18 },
    metaTitle: { type: DataTypes.STRING },
    metaDescription: { type: DataTypes.TEXT },
    warrantyMonths: { type: DataTypes.INTEGER, defaultValue: 12 },
  });
  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(models.Brand, { foreignKey: 'brandId', as: 'brand' });
    Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
    Product.hasMany(models.ProductSpecification, { foreignKey: 'productId', as: 'specifications' });
    Product.hasMany(models.Review, { foreignKey: 'productId', as: 'reviews' });
    Product.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems' });
    Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
    Product.hasMany(models.Wishlist, { foreignKey: 'productId', as: 'wishlists' });
  };
  return Product;
};
