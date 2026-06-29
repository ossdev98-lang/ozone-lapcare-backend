const { Ad } = require('../models');
const { success, error } = require('../utils/response');
const { uploadToLocal, deleteFromLocal } = require('../middlewares/upload');

exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    return success(res, ads);
  } catch (err) { return error(res, err.message); }
};

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    return success(res, ads);
  } catch (err) { return error(res, err.message); }
};

exports.createAd = async (req, res) => {
  try {
    const { title, link, isActive, sortOrder } = req.body;
    if (!req.file) return error(res, 'Ad image is required', 400);
    const image = uploadToLocal(req.file, 'ads');
    const ad = await Ad.create({ title, image, link, isActive: isActive !== 'false', sortOrder: Number(sortOrder) || 0 });
    return success(res, ad, 'Ad created', 201);
  } catch (err) { return error(res, err.message); }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return error(res, 'Ad not found', 404);
    const update = { ...req.body };
    if (req.file) {
      deleteFromLocal(ad.image);
      update.image = uploadToLocal(req.file, 'ads');
    }
    if (update.isActive !== undefined) update.isActive = update.isActive === 'true';
    if (update.sortOrder !== undefined) update.sortOrder = Number(update.sortOrder);
    await ad.update(update);
    return success(res, ad, 'Ad updated');
  } catch (err) { return error(res, err.message); }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return error(res, 'Ad not found', 404);
    deleteFromLocal(ad.image);
    await ad.destroy();
    return success(res, null, 'Ad deleted');
  } catch (err) { return error(res, err.message); }
};
