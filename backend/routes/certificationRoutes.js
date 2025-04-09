const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const path = require('path');
const {
  addCertification,
  getCertifications,
  getCertification,
  updateCertification,
  deleteCertification,
<<<<<<< Updated upstream
=======
  analyzeCertificationHandler,
>>>>>>> Stashed changes
  upload
} = require('../controllers/certificationController');

<<<<<<< Updated upstream
// All routes are protected (require authentication)
=======
// Test route for Gemini AI - no auth required for testing
router.get('/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini AI configuration...');
    
    // Test the connection
    await testGeminiConnection();
    
    // If we get here, the test was successful
    res.json({ 
      success: true, 
      message: 'Gemini AI connection test successful'
    });
  } catch (error) {
    console.error('Gemini AI test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route to serve certificate files - no auth required for direct file access
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Certificate file not found' });
    }
  });
});

// All routes below this are protected
>>>>>>> Stashed changes
router.use(protect);

// Get all certifications
router.get('/', getCertifications);

// Get single certification
router.get('/:id', getCertification);

// Add new certification
router.post('/', upload.single('certificateFile'), addCertification);

<<<<<<< Updated upstream
=======
// Analyze certificate
router.post('/analyze', upload.single('certificateFile'), analyzeCertificationHandler);

>>>>>>> Stashed changes
// Update certification
router.put('/:id', updateCertification);

// Delete certification
router.delete('/:id', deleteCertification);

module.exports = router; 