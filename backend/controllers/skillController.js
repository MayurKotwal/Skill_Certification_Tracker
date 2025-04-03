const Skill = require('../models/skillModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Private
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ users: req.user._id });
  res.json(skills);
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Private
const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  // Check if the skill belongs to the user
  if (!skill.users.includes(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(skill);
});

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = asyncHandler(async (req, res) => {
  const { name, category, description, level } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error('Please provide name and category');
  }

  // Check if skill already exists
  let skill = await Skill.findOne({ name });

  if (skill) {
    // If skill exists, add user to it
    if (!skill.users.includes(req.user._id)) {
      skill.users.push(req.user._id);
      await skill.save();
    }
  } else {
    // Create new skill
    skill = await Skill.create({
      name,
      category,
      description,
      level: level || 'beginner',
      users: [req.user._id]
    });
  }

  res.status(201).json(skill);
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  // Check if the skill belongs to the user
  if (!skill.users.includes(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedSkill);
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  // Check if the skill belongs to the user
  if (!skill.users.includes(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Remove user from skill's users array
  skill.users = skill.users.filter(userId => userId.toString() !== req.user._id.toString());
  
  if (skill.users.length === 0) {
    // If no users left, delete the skill
    await skill.remove();
  } else {
    await skill.save();
  }

  res.json({ message: 'Skill removed' });
});

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
}; 