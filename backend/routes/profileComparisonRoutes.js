const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchProfiles, compareProfiles, getAllProfiles } = require('../controllers/profileComparisonController');

router.get('/', getAllProfiles);
router.get('/search', searchProfiles);
router.post('/compare', protect, compareProfiles);

module.exports = router; 