const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store file in memory so we can stream it to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'garnetsky' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: { code: 'UPLOAD_FAILED', message: 'Image upload failed' } });
      }
      res.json({ url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;
