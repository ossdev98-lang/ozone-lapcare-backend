const { Op } = require('sequelize');
const { Product, Category, Brand, ProductImage, ProductSpecification, Review, User } = require('../models');
const { success, error, paginate } = require('../utils/response');
const { slugify } = require('../utils/helpers');
const { uploadToLocal, deleteFromLocal } = require('../middlewares/upload');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, brand, minPrice, maxPrice, condition, search, sort = 'createdAt', order = 'DESC', isFeatured, isFlashSale, status } = req.query;
    const where = {};
    if (status) where.status = status;
    else where.status = 'active';
    if (category) where.categoryId = category;
    if (brand) where.brandId = brand;
    if (condition) where.condition = condition;
    if (isFeatured) where.isFeatured = true;
    if (isFlashSale) where.isFlashSale = true;
    if (minPrice || maxPrice) where.price = { ...(minPrice && { [Op.gte]: minPrice }), ...(maxPrice && { [Op.lte]: maxPrice }) };
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }];
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'logo'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'url', 'isPrimary', 'sortOrder'], required: false },
        { model: ProductSpecification, as: 'specifications', attributes: ['id', 'key', 'value'], required: false },
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true,
    });
    return paginate(res, rows, count, page, limit);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, status: 'active' },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images', order: [['sortOrder', 'ASC']] },
        { model: ProductSpecification, as: 'specifications', order: [['sortOrder', 'ASC']] },
        { model: Review, as: 'reviews', include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }], where: { isApproved: true }, required: false, limit: 10 },
      ],
    });
    if (!product) return error(res, 'Product not found', 404);
    await product.increment('viewCount');
    return success(res, product);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.name);
    const product = await Product.create(data);
    if (data.specifications) {
      await ProductSpecification.bulkCreate(data.specifications.map(s => ({ ...s, productId: product.id })));
    }
    return success(res, product, 'Product created', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found', 404);
    if (req.body.name) req.body.slug = slugify(req.body.name);
    
    // Handle specifications separately
    const specifications = req.body.specifications || [];
    delete req.body.specifications;
    
    await product.update(req.body);
    
    // Sync specifications
    if (specifications.length >= 0) {
      await ProductSpecification.destroy({ where: { productId: product.id } });
      if (specifications.length > 0) {
        await ProductSpecification.bulkCreate(
          specifications.map(s => ({ ...s, productId: product.id }))
        );
      }
    }
    
    const updated = await Product.findOne({
      where: { id: product.id },
      include: [{ model: ProductSpecification, as: 'specifications', attributes: ['id', 'key', 'value'] }]
    });
    
    return success(res, updated, 'Product updated');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found', 404);
    await product.update({ status: 'inactive' });
    return success(res, null, 'Product deleted');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found', 404);
    const images = req.files.map(file => ({
      productId: product.id,
      url: uploadToLocal(file, 'products'),
      publicId: null,
    }));
    const created = await ProductImage.bulkCreate(images);
    if (!product.thumbnail && created.length) await product.update({ thumbnail: created[0].url });
    return success(res, created, 'Images uploaded', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const img = await ProductImage.findByPk(req.params.imageId);
    if (!img) return error(res, 'Image not found', 404);
    deleteFromLocal(img.url);
    await img.destroy();
    return success(res, null, 'Image deleted');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found', 404);
    const products = await Product.findAll({
      where: { categoryId: product.categoryId, id: { [Op.ne]: product.id }, status: 'active' },
      include: [{ model: ProductImage, as: 'images', where: { isPrimary: true }, required: false, limit: 1 }],
      limit: 8,
    });
    return success(res, products);
  } catch (err) {
    return error(res, err.message);
  }
};
