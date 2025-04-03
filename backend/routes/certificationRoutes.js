const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addCertification,
  getCertifications,
  getCertification,
  updateCertification,
  deleteCertification,
  upload
} = require('../controllers/certificationController');

// All routes are protected (require authentication)
router.use(protect);

// Get all certifications
router.get('/', getCertifications);

// Get single certification
router.get('/:id', getCertification);

// Add new certification
router.post('/', upload.single('certificateFile'), addCertification);

// Update certification
router.put('/:id', updateCertification);

// Delete certification
router.delete('/:id', deleteCertification);

module.exports = router; 