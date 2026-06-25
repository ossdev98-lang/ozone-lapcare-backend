const { Category, Brand, Product } = require('../models');
const { success, error } = require('../utils/response');
const { slugify } = require('../utils/helpers');
const { uploadToLocal } = require('../middlewares/upload');

// Categories
exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.findAll({ where: { isActive: true, parentId: null }, include: [{ model: Category, as: 'children' }], order: [['sortOrder', 'ASC']] });
    return success(res, cats);
  } catch (err) { return error(res, err.message); }
};

exports.getCategory = async (req, res) => {
  try {
    const cat = await Category.findOne({ where: { slug: req.params.slug } });
    if (!cat) return error(res, 'Category not found', 404);
    return success(res, cat);
  } catch (err) { return error(res, err.message); }
};

exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.name);
    if (req.file) data.image = uploadToLocal(req.file, 'categories');
    const cat = await Category.create(data);
    return success(res, cat, 'Category created', 201);
  } catch (err) { return error(res, err.message); }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return error(res, 'Category not found', 404);
    if (req.file) req.body.image = uploadToLocal(req.file, 'categories');
    await cat.update(req.body);
    return success(res, cat, 'Category updated');
  } catch (err) { return error(res, err.message); }
};

exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return error(res, 'Category not found', 404);
    await cat.update({ isActive: false });
    return success(res, null, 'Category deleted');
  } catch (err) { return error(res, err.message); }
};

// Brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    return success(res, brands);
  } catch (err) { return error(res, err.message); }
};

exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ where: { slug: req.params.slug } });
    if (!brand) return error(res, 'Brand not found', 404);
    return success(res, brand);
  } catch (err) { return error(res, err.message); }
};

exports.createBrand = async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.name);
    if (req.file) data.logo = uploadToLocal(req.file, 'brands');
    const brand = await Brand.create(data);
    return success(res, brand, 'Brand created', 201);
  } catch (err) { return error(res, err.message); }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return error(res, 'Brand not found', 404);
    if (req.file) req.body.logo = uploadToLocal(req.file, 'brands');
    await brand.update(req.body);
    return success(res, brand, 'Brand updated');
  } catch (err) { return error(res, err.message); }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return error(res, 'Brand not found', 404);
    await brand.update({ isActive: false });
    return success(res, null, 'Brand deleted');
  } catch (err) { return error(res, err.message); }
};
