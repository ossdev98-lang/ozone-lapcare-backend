const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // derive subfolder from route: /products → products, /categories → categories, etc.
    const segment = req.baseUrl?.split('/').filter(Boolean).pop() || 'misc';
    const dir = path.join(UPLOADS_ROOT, segment);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * Returns the public URL path for the saved file.
 * @param {Express.Multer.File} file
 * @param {string} subfolder  e.g. 'products', 'categories', 'brands'
 */
const uploadToLocal = (file, subfolder = 'misc') => {
  // If diskStorage already placed the file, just derive URL from its path
  if (file.path) {
    const relative = path.relative(UPLOADS_ROOT, file.path).replace(/\\/g, '/');
    return `/uploads/${relative}`;
  }
  // Fallback: save buffer manually (for any remaining memoryStorage usage)
  const dir = path.join(UPLOADS_ROOT, subfolder);
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${subfolder}/${filename}`;
};

/**
 * Deletes a locally stored file given its public URL path.
 * @param {string} urlPath  e.g. '/uploads/products/123.jpg'
 */
const deleteFromLocal = (urlPath) => {
  if (!urlPath) return;
  const filePath = path.join(UPLOADS_ROOT, urlPath.replace(/^\/uploads\//, ''));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

module.exports = { upload, uploadToLocal, deleteFromLocal };
