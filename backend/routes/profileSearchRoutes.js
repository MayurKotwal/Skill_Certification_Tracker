const express = require('express');
const router = express.Router();
const { getAllProfiles, searchProfiles } = require('../controllers/profileSearchController');

// GET /api/search/profiles - Get all profiles
router.get('/profiles', getAllProfiles);

// GET /api/search/profiles/search - Search profiles
router.get('/profiles/search', searchProfiles);

module.exports = router; 