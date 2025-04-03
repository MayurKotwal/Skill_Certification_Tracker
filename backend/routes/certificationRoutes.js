const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addCertification,
  getCertifications,
  getCertification,
  updateCertification,
  deleteCertification,
  getCertificationFile,
  upload
} = require('../controllers/certificationController');
const multer = require('multer');

// All routes are protected (require authentication)
router.use(protect);

// Error handling middleware for file upload
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Get all certifications
router.get('/', getCertifications);

// Get single certification
router.get('/:id', getCertification);

// Get certification file
router.get('/file/:id', getCertificationFile);

// Add new certification
router.post('/', upload.single('certificateFile'), addCertification);

// Update certification
router.put('/:id', updateCertification);

// Delete certification
router.delete('/:id', deleteCertification);

module.exports = router; 