const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

// All routes are protected (require authentication)
router.use(protect);

router.route('/')
  .get(getSkills)
  .post(addSkill);

router.route('/:id')
  .put(updateSkill)
  .delete(deleteSkill);

module.exports = router; 