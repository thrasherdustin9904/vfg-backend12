// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

// Single image upload
router.post('/image', upload.single('image'), (req, res) => {
  try {
    // req.file.path contains the Cloudinary URL
    return res.json({
      success: true,
      url: req.file.path
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Multiple images upload
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    const urls = req.files.map(f => f.path);
    return res.json({ success: true, urls });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
