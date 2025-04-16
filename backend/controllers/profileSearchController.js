const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all profiles
// @route   GET /api/search/profiles
// @access  Public
const getAllProfiles = asyncHandler(async (req, res) => {
  try {
    // Get all profiles regardless of visibility status
    const allProfiles = await User.find()
      .select('name email skills certifications bio')
      .populate('skills', 'name level category')
      .populate('certifications', 'title issuer issueDate');
    
    console.log(`Found ${allProfiles.length} total profiles`);
    
    if (allProfiles.length === 0) {
      // Return mock data for testing if no profiles exist
      return res.json([
        {
          _id: '123456789012345678901234',
          name: 'Test User 1',
          email: 'test1@example.com',
          skills: [
            { _id: 'skill1', name: 'JavaScript', level: 'Advanced' },
            { _id: 'skill2', name: 'React', level: 'Intermediate' }
          ],
          certifications: [
            { _id: 'cert1', title: 'Web Development', issuer: 'Coding Academy' }
          ]
        },
        {
          _id: '123456789012345678901235',
          name: 'Test User 2',
          email: 'test2@example.com',
          skills: [
            { _id: 'skill3', name: 'Python', level: 'Advanced' },
            { _id: 'skill4', name: 'Data Analysis', level: 'Intermediate' }
          ],
          certifications: [
            { _id: 'cert2', title: 'Data Science', issuer: 'DataCamp' }
          ]
        }
      ]);
    }
    
    res.json(allProfiles);
  } catch (error) {
    console.error('Error in getAllProfiles:', error);
    res.status(500).json({ message: 'Error retrieving profiles', error: error.message });
  }
});

// @desc    Search profiles
// @route   GET /api/search/profiles/search
// @access  Public
const searchProfiles = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  try {
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const profiles = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name email skills certifications bio')
    .populate('skills', 'name level category')
    .populate('certifications', 'title issuer issueDate');
    
    console.log(`Search for "${query}" found ${profiles.length} profiles`);
    
    res.json(profiles);
  } catch (error) {
    console.error('Error in searchProfiles:', error);
    res.status(500).json({ message: 'Error searching profiles', error: error.message });
  }
});

module.exports = {
  getAllProfiles,
  searchProfiles
}; 