const { model } = require('../config/geminiConfig');
const Skill = require('../models/skillModel');
const User = require('../models/userModel');

// Function to extract skills from certificate content
async function extractSkillsFromCertificate(certificateData) {
  try {
    const prompt = `
      Analyze this certification information and extract a list of relevant skills.
      Consider both explicit skills mentioned and implicit skills that would be gained from this certification.

      Certificate Information:
      Title: ${certificateData.title}
      Issuer: ${certificateData.issuer}
      Description: ${certificateData.description || 'Not provided'}
      
      Return the response as a JSON object with the following structure:
      {
        "skills": [
          {
            "name": "skill name",
            "level": "beginner/intermediate/advanced",
            "category": "category name",
            "confidence": 0.0 to 1.0
          }
        ]
      }

      Only include skills with confidence > 0.7
    `;

    const result = await model.generateContent(prompt);
    const extractedData = JSON.parse(await result.response.text());
    return extractedData.skills;
  } catch (error) {
    console.error('Error extracting skills:', error);
    return [];
  }
}

// Function to add extracted skills to user
async function addExtractedSkillsToUser(userId, extractedSkills) {
  try {
    console.log('Starting skill addition for user:', userId);
    console.log('Skills to be added:', JSON.stringify(extractedSkills, null, 2));
    
    if (!extractedSkills || extractedSkills.length === 0) {
      console.log('No skills to add');
      return [];
    }

    const addedSkills = [];
    const user = await User.findById(userId).populate('skills');
    
    if (!user) {
      throw new Error('User not found');
    }

    console.log('Current user skills:', user.skills.map(s => s.name));

    for (const skillData of extractedSkills) {
      try {
        // Normalize skill data
        const normalizedName = skillData.name.toLowerCase().trim();
        const normalizedCategory = skillData.category.trim();
        const skillLevel = skillData.level || 'beginner';
        
        console.log('Processing skill:', {
          name: normalizedName,
          category: normalizedCategory,
          level: skillLevel
        });
        
        // Check if skill already exists
        let skill = await Skill.findOne({ name: normalizedName });

        if (skill) {
          console.log('Found existing skill:', skill.name);
          // Update skill if needed
          if (skill.level !== skillLevel || skill.category !== normalizedCategory) {
            skill.level = skillLevel;
            skill.category = normalizedCategory;
            skill = await skill.save();
            console.log('Updated existing skill:', skill.name);
          }
          
          // If user doesn't have this skill
          if (!user.skills.some(s => s._id.toString() === skill._id.toString())) {
            console.log('Adding existing skill to user:', skill.name);
            user.skills.push(skill._id);
            
            // Add user to skill's users array if not present
            if (!skill.users.includes(userId)) {
              skill.users.push(userId);
              await skill.save();
            }
          }
        } else {
          console.log('Creating new skill:', normalizedName);
          // Create new skill
          skill = await Skill.create({
            name: normalizedName,
            category: normalizedCategory,
            level: skillLevel,
            users: [userId]
          });
          console.log('Created new skill:', skill.name);
          
          // Add to user's skills
          user.skills.push(skill._id);
        }
        
        addedSkills.push(skill);
      } catch (skillError) {
        console.error('Error processing individual skill:', skillError);
        console.error('Problematic skill data:', skillData);
      }
    }

    // Save user with updated skills
    await user.save();
    console.log('Saved user with updated skills. Total skills:', user.skills.length);

    // Return fully populated skills
    const populatedSkills = await Skill.find({
      _id: { $in: addedSkills.map(skill => skill._id) }
    });
    
    console.log('Returning populated skills:', 
      populatedSkills.map(s => ({
        name: s.name,
        level: s.level,
        category: s.category
      }))
    );
    
    return populatedSkills;
  } catch (error) {
    console.error('Error in addExtractedSkillsToUser:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

module.exports = {
  extractSkillsFromCertificate,
  addExtractedSkillsToUser
}; 