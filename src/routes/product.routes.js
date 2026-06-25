const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.get('/', ctrl.getProducts);
router.get('/:slug', ctrl.getProduct);
router.get('/:id/related', ctrl.getRelatedProducts);
router.post('/', authenticate, authorize('ADMIN'), ctrl.createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), ctrl.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deleteProduct);
router.post('/:id/images', authenticate, authorize('ADMIN'), upload.array('images', 10), ctrl.uploadImages);
router.delete('/:id/images/:imageId', authenticate, authorize('ADMIN'), ctrl.deleteImage);

module.exports = router;
