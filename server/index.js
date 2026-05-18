const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const status = require('./helpers/response');

const app = express();
const PORT = Number(process.env.PORT) || 3020;

app.set('trust proxy', true);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/media', require('./routes/media'));
app.use('/api/v1/global-settings', require('./routes/globalSettings'));
app.use('/api/v1/email-settings', require('./routes/emailSettings'));
app.use('/api/v1', require('./routes/home'));
app.use('/api/v1', require('./routes/about'));
app.use('/api/v1', require('./routes/products'));
app.use('/api/v1', require('./routes/gallery'));
app.use('/api/v1', require('./routes/cmsPages'));
app.use('/api/v1', require('./routes/footer'));
app.use('/api/v1/navigation', require('./routes/navigation'));
app.use('/api/geo', require('./routes/geo'));
app.use('/api/v1/activity-logs', require('./routes/activityLogs'));
app.use('/api/v1', require('./routes/versionHistory'));
app.use('/api/v1/contact-submissions', require('./routes/contactSubmissions'));
app.use('/api/contact-submissions', require('./routes/contactSubmissions'));

// Uploads
const uploadImage = require('./middlewares/uploadImage');
const uploadDocument = require('./middlewares/uploadDocument');
const multer = require('multer');

const { authenticate, authorize } = require('./middlewares/auth');
const cmsWrite = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

app.post('/api/v1/upload/image', ...cmsWrite, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const imageUrl = `/uploads/${year}/${month}/${req.file.filename}`;
    const { Media } = require('./models');
    const ext = path.extname(req.file.originalname || req.file.filename).toLowerCase();
    let fileType = 'image';
    if (ext === '.svg') fileType = 'svg';
    const media = await Media.create({
      fileName: req.file.originalname || req.file.filename,
      filePath: imageUrl,
      fileType,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      altText: req.body.altText || '',
    });
    res.json({ success: true, imageUrl, mediaId: media.id, media });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Modepro CMS server is running', timestamp: new Date().toISOString() });
});

app.all('/api/v1/*', (req, res) => {
  return status.responseStatus(res, 404, 'Endpoint Not Found');
});

// Static frontend
const clientOut = path.join(__dirname, '..', 'client', 'out');
if (fs.existsSync(clientOut)) {
  app.use(express.static(clientOut));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientOut, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

const SKIP_SYNC = process.env.SKIP_DB_SYNC === 'true';

function startServer() {
  app.listen(PORT, () => {
    console.log(`Modepro CMS server listening on http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/v1/health`);
  });
}

sequelize
  .authenticate()
  .then(() => {
    if (SKIP_SYNC) return startServer();
    return sequelize.sync({ alter: false }).then(() => startServer());
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.error('Run database/modepro_cms_setup.sql and configure server/.env');
    process.exit(1);
  });
