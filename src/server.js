require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const apiRoutes = require('./routes/index');
const db = require('./models');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'https://ozonelapcare.com', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const isDev = process.env.NODE_ENV !== 'production';
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: isDev ? 200 : 20, message: 'Too many requests', skip: req => isDev && req.ip === '::1' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: isDev ? 1000 : 200, skip: req => isDev && req.ip === '::1' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', apiRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only authenticate (test connection) — migrations manage the schema
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
