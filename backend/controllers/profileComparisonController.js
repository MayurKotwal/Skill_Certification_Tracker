const ProfileComparison = require('../models/profileComparisonModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Search for profiles
// @route   GET /api/profiles/search
// @access  Public
const searchProfiles = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  const profiles = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { 'skills.name': { $regex: query, $options: 'i' } },
      { 'certifications.title': { $regex: query, $options: 'i' } }
    ],
    isPublic: true
  }).select('name email skills certifications');

  res.json(profiles);
});

// @desc    Compare two profiles
// @route   POST /api/profiles/compare
// @access  Private
const compareProfiles = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.body;

  // Check if comparison already exists
  let comparison = await ProfileComparison.findOne({
    $or: [
      { user1: userId1, user2: userId2 },
      { user1: userId2, user2: userId1 }
    ]
  });

  if (comparison) {
    return res.json(comparison);
  }

  // Get user profiles
  const user1 = await User.findById(userId1).populate('skills certifications');
  const user2 = await User.findById(userId2).populate('skills certifications');

  if (!user1 || !user2) {
    res.status(404);
    throw new Error('One or both users not found');
  }

  // Analyze profiles
  const analysis = analyzeProfiles(user1, user2);

  // Create new comparison
  comparison = await ProfileComparison.create({
    user1: userId1,
    user2: userId2,
    analysis
  });

  res.status(201).json(comparison);
});

// Helper function to analyze profiles
const analyzeProfiles = (user1, user2) => {
  // Find common and unique skills
  const commonSkills = findCommonSkills(user1.skills, user2.skills);
  const uniqueSkills = findUniqueSkills(user1.skills, user2.skills);

  // Find common and unique certifications
  const commonCerts = findCommonCertifications(user1.certifications, user2.certifications);
  const uniqueCerts = findUniqueCertifications(user1.certifications, user2.certifications);

  // Generate recommendations based on skills and certifications
  const recommendations = generateRecommendations(commonSkills, uniqueSkills, commonCerts, uniqueCerts);

  return {
    commonSkills,
    uniqueSkills,
    certificationComparison: {
      common: commonCerts,
      unique: uniqueCerts
    },
    recommendations
  };
};

// Helper functions
const findCommonSkills = (skills1, skills2) => {
  return skills1.filter(skill1 => 
    skills2.some(skill2 => skill1.name === skill2.name)
  );
};

const findUniqueSkills = (skills1, skills2) => {
  return [
    {
      user: 'user1',
      skills: skills1.filter(skill1 => 
        !skills2.some(skill2 => skill1.name === skill2.name)
      )
    },
    {
      user: 'user2',
      skills: skills2.filter(skill2 => 
        !skills1.some(skill1 => skill1.name === skill1.name)
      )
    }
  ];
};

const findCommonCertifications = (certs1, certs2) => {
  return certs1.filter(cert1 => 
    certs2.some(cert2 => cert1.title === cert2.title)
  );
};

const findUniqueCertifications = (certs1, certs2) => {
  return [
    {
      user: 'user1',
      certifications: certs1.filter(cert1 => 
        !certs2.some(cert2 => cert1.title === cert2.title)
      )
    },
    {
      user: 'user2',
      certifications: certs2.filter(cert2 => 
        !certs1.some(cert1 => cert1.title === cert2.title)
      )
    }
  ];
};

const generateRecommendations = (commonSkills, uniqueSkills, commonCerts, uniqueCerts) => {
  // Generate skill gap analysis
  const skillGaps = uniqueSkills.map(userSkills => ({
    user: userSkills.user,
    skills: userSkills.skills.map(skill => ({
      skill: skill.name,
      suggestedCertifications: suggestCertifications(skill.name)
    }))
  }));

  // Generate career path suggestions based on common skills and certifications
  const careerPaths = generateCareerPaths(commonSkills, commonCerts);

  return {
    skillGaps,
    careerPaths
  };
};

const suggestCertifications = (skill) => {
  // Map of skills to relevant certifications
  const skillCertificationMap = {
    'JavaScript': ['JavaScript Developer Certification', 'Web Development Certification'],
    'Python': ['Python Developer Certification', 'Data Science Certification'],
    'Java': ['Java Developer Certification', 'Enterprise Development Certification'],
    'SQL': ['Database Administrator Certification', 'Data Analysis Certification'],
    'React': ['Frontend Development Certification', 'Web Development Certification'],
    'Node.js': ['Backend Development Certification', 'Full Stack Development Certification'],
    'AWS': ['AWS Cloud Practitioner', 'AWS Solutions Architect'],
    'Machine Learning': ['Machine Learning Certification', 'AI Developer Certification'],
    'Data Analysis': ['Data Analyst Certification', 'Business Intelligence Certification'],
    'Project Management': ['PMP Certification', 'Agile Certification']
  };

  return skillCertificationMap[skill] || [`${skill} Certification`, `Advanced ${skill} Certification`];
};

const generateCareerPaths = (commonSkills, commonCerts) => {
  // Define career paths based on skills and certifications
  const careerPaths = [
    {
      name: 'Full Stack Developer',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      suggestedCertifications: ['Web Development Certification', 'Full Stack Development Certification']
    },
    {
      name: 'Data Scientist',
      requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
      suggestedCertifications: ['Data Science Certification', 'Machine Learning Certification']
    },
    {
      name: 'Cloud Engineer',
      requiredSkills: ['AWS', 'Python', 'Linux'],
      suggestedCertifications: ['AWS Cloud Practitioner', 'Cloud Architecture Certification']
    },
    {
      name: 'DevOps Engineer',
      requiredSkills: ['Linux', 'AWS', 'Python', 'Node.js'],
      suggestedCertifications: ['DevOps Certification', 'Cloud Architecture Certification']
    }
  ];

  // Find matching career paths based on common skills
  return careerPaths.filter(path => {
    const matchingSkills = path.requiredSkills.filter(skill => 
      commonSkills.some(commonSkill => commonSkill.name === skill)
    );
    return matchingSkills.length >= 2; // At least 2 matching skills required
  });
};

module.exports = {
  searchProfiles,
  compareProfiles
}; 