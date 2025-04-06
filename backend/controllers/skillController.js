const Skill = require('../models/skillModel');
const User = require('../models/userModel');
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

// @desc    Add new skill
// @route   POST /api/skills
// @access  Private
const addSkill = asyncHandler(async (req, res) => {
  const { name, level, category } = req.body;

  // Normalize skill name
  const normalizedName = name.toLowerCase().trim();

  // Check if skill already exists
  let skill = await Skill.findOne({ name: normalizedName });

  if (skill) {
    // If skill exists, add user to skill's users array if not present
    if (!skill.users.includes(req.user._id)) {
      skill.users.push(req.user._id);
      await skill.save();
    }
  } else {
    // Create new skill
    skill = await Skill.create({
      name: normalizedName,
      level,
      category,
      users: [req.user._id]
    });
  }

<<<<<<< Updated upstream
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

  // Update the user's skills array
  const user = await User.findById(req.user._id);
  if (user) {
    if (!user.skills.includes(skill._id)) {
      user.skills.push(skill._id);
      await user.save();
    }
  }

=======
  // Add skill to user's skills array if not present
  const user = await User.findById(req.user._id);
  if (!user.skills.includes(skill._id)) {
    user.skills.push(skill._id);
    await user.save();
  }

>>>>>>> Stashed changes
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

  // Check if user owns the skill
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

  // Check if user owns the skill
  if (!skill.users.includes(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Remove skill from user's skills array
  const user = await User.findById(req.user._id);
  user.skills = user.skills.filter(skillId => skillId.toString() !== req.params.id);
  await user.save();

  // Remove user from skill's users array
  skill.users = skill.users.filter(userId => userId.toString() !== req.user._id.toString());
  
  // If no users left, delete the skill
  if (skill.users.length === 0) {
    await skill.deleteOne();
  } else {
    await skill.save();
  }

  res.json({ message: 'Skill removed' });
});

module.exports = {
  getSkills,
  getSkill,
  addSkill,
  updateSkill,
  deleteSkill
}; 