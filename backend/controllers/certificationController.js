const Certification = require('../models/certificationModel');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
<<<<<<< Updated upstream
const fs = require('fs');
=======
const fs = require('fs').promises;
const { analyzeCertificate, validateCertificateAuthenticity } = require('../utils/certificateAnalyzer');
const { extractSkillsFromCertificate, addExtractedSkillsToUser } = require('../utils/skillExtractor');
<<<<<<< Updated upstream
const { testConnection } = require('../config/geminiConfig');
>>>>>>> Stashed changes
=======
const Skill = require('../models/skillModel');
>>>>>>> Stashed changes

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Private
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({ user: req.user._id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(certifications);
});

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Private
const getCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }

  // Check if the certification belongs to the user
  if (certification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(certification);
});

// @desc    Add a new certification
// @route   POST /api/certifications
// @access  Private
const addCertification = asyncHandler(async (req, res) => {
  const { title, issuer, issueDate, expiryDate, credentialId, description } = req.body;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  if (!title || !issuer || !issueDate) {
    res.status(400);
    throw new Error('Please provide title, issuer, and issue date');
=======
=======
    // Get the user first and populate their skills and certifications
    const user = await User.findById(req.user.id)
      .populate('skills')
      .populate('certifications');
    
    if (!user) {
      throw new Error('User not found');
    }

>>>>>>> Stashed changes
    let aiAnalysis = null;
    let authenticity = null;
    let extractedSkills = [];
    let certificateFile = null;

<<<<<<< Updated upstream
    // If a certificate file is uploaded, process and save it
    if (req.file) {
      try {
        // Save the file
        const uploadDir = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        
        certificateFile = `${Date.now()}-${req.file.originalname}`;
        await fs.writeFile(
          path.join(uploadDir, certificateFile),
          req.file.buffer
        );

        // Determine file type and analyze
        const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
        
        try {
          // Analyze certificate
          aiAnalysis = await analyzeCertificate(
            req.file.buffer,
            fileType,
            { title, issuer, issueDate, credentialId }
          );

          // Validate authenticity
          if (aiAnalysis) {
            authenticity = await validateCertificateAuthenticity(aiAnalysis);
          }
        } catch (analysisError) {
          console.error('Certificate analysis error:', analysisError);
          // Continue without AI analysis
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
        // Continue without file processing
      }
    }

    // Create certification without waiting for AI analysis
=======
    // Parse confirmed skills from the frontend
    let confirmedSkills = [];
    if (req.body.confirmedSkills) {
      try {
        confirmedSkills = JSON.parse(req.body.confirmedSkills);
        console.log('Received confirmed skills from frontend:', confirmedSkills);
        
        // Normalize skills
        confirmedSkills = confirmedSkills.map(skill => ({
          name: skill.name.toLowerCase().trim(),
          level: skill.level || 'beginner',
          category: skill.category || 'Programming Languages',
          confidence: skill.confidence || 1.0
        }));
        
        console.log('Normalized confirmed skills:', confirmedSkills);
        extractedSkills = confirmedSkills;
      } catch (error) {
        console.error('Error parsing confirmed skills:', error);
        console.error('Raw confirmedSkills data:', req.body.confirmedSkills);
        return res.status(400).json({ message: 'Invalid skills data format' });
      }
    }

    // If a certificate file is uploaded, analyze it
    if (req.file) {
      try {
        const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
        aiAnalysis = await analyzeCertificate(
          req.file.buffer,
          fileType,
          { title, issuer, issueDate, credentialId }
        );
        authenticity = await validateCertificateAuthenticity(aiAnalysis);
<<<<<<< Updated upstream
        console.log('Certificate authenticity score:', authenticity.authenticity_score);
=======

        // If there are major discrepancies, flag them
        if (authenticity.authenticity_score < 0.5) {
          console.log('Warning: Low certificate authenticity score:', authenticity.authenticity_score);
          if (!authenticity.flags) authenticity.flags = [];
          authenticity.flags.push('Low authentication score, but you can still proceed');
        }
>>>>>>> Stashed changes
      } catch (error) {
        console.error('AI Analysis Error:', error);
        aiAnalysis = null;
        authenticity = {
          authenticity_score: 1,
          confidence_level: "medium",
          flags: [],
          recommendations: []
        };
      }
    }

    // Create the certification
>>>>>>> Stashed changes
    const certification = new Certification({
      user: req.user.id,
      title,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      description,
      certificateFile,
      aiAnalysis: aiAnalysis ? {
        extractedInfo: aiAnalysis.extracted_info,
        validation: aiAnalysis.validation,
        suggestedSkills: aiAnalysis.suggested_skills,
        category: aiAnalysis.category,
        authenticity: authenticity
      } : undefined,
      skills: [] // Initialize empty skills array
    });

    // Save the certification first to get its ID
    await certification.save();
    console.log('Certification saved:', certification._id);

<<<<<<< Updated upstream
    // Add certification to user's certifications array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { certifications: certification._id } }
    );

    // Extract and add skills if AI analysis was successful
    if (aiAnalysis?.suggested_skills) {
      try {
        extractedSkills = await extractSkillsFromCertificate({
          title,
          issuer,
          description,
          aiAnalysis
        });

        if (extractedSkills.length > 0) {
          await addExtractedSkillsToUser(req.user.id, extractedSkills);
        }
      } catch (skillError) {
        console.error('Skill extraction error:', skillError);
      }
    }

    // Prepare response
    const response = {
      certification,
      message: 'Certification added successfully'
    };

    if (extractedSkills.length > 0) {
      response.addedSkills = extractedSkills;
      response.message += ` with ${extractedSkills.length} new skills extracted`;
    }

    if (aiAnalysis?.suggested_skills) {
      response.suggestedSkills = aiAnalysis.suggested_skills;
    }

    if (authenticity) {
      response.authenticity = authenticity;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Error in addCertification:', error);
    res.status(500).json({ 
      message: 'Error adding certification', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
>>>>>>> Stashed changes
=======
    // Add certification to user's certifications
    user.certifications.push(certification._id);

    // Process each skill
    const addedSkills = [];
    if (extractedSkills && extractedSkills.length > 0) {
      for (const skillData of extractedSkills) {
        try {
          // Find or create the skill (case-insensitive search)
          let skill = await Skill.findOne({
            name: { $regex: new RegExp(`^${skillData.name}$`, 'i') }
          });

          if (!skill) {
            // Create new skill
            skill = new Skill({
              name: skillData.name.toLowerCase(),
              category: skillData.category,
              level: skillData.level,
              users: [user._id],
              certifications: [certification._id]
            });
          } else {
            // Update existing skill relationships
            if (!skill.users.includes(user._id)) {
              skill.users.push(user._id);
            }
            if (!skill.certifications.includes(certification._id)) {
              skill.certifications.push(certification._id);
            }
          }
          
          // Save the skill
          await skill.save();
          console.log('Skill saved:', skill._id);

          // Add skill to certification's skills array if not already present
          if (!certification.skills.includes(skill._id)) {
            certification.skills.push(skill._id);
          }

          // Add skill to user's skills array if not already present
          if (!user.skills.some(s => s._id.toString() === skill._id.toString())) {
            user.skills.push(skill._id);
          }

          addedSkills.push(skill);
        } catch (error) {
          console.error(`Error processing skill ${skillData.name}:`, error);
          // Continue with other skills even if one fails
        }
      }
    }

    // Save the updated certification with skills
    await certification.save();
    console.log('Certification updated with skills');

    // Save the user with updated skills and certifications
    await user.save();
    console.log('User updated with new skills and certification');

    // Save the file to disk if it exists
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, certification.certificateFile);
      fs.writeFileSync(filePath, req.file.buffer);
      console.log('Certificate file saved to disk');
    }

    // Return the response with populated data
    const populatedCertification = await Certification.findById(certification._id)
      .populate('skills')
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Certification added successfully',
      certification: populatedCertification,
      addedSkills: addedSkills,
      authenticity: authenticity
    });

  } catch (error) {
    console.error('Error in addCertification:', error);
    res.status(500).json({
      message: 'Error adding certification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
>>>>>>> Stashed changes
  }

  // Create the certification
  const certification = await Certification.create({
    user: req.user._id,
    title,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    description,
    certificateFile: req.file ? req.file.filename : null
  });

  // Update the user's certifications array
  const user = await User.findById(req.user._id);
  if (user) {
    user.certifications.push(certification._id);
    await user.save();
  }

  res.status(201).json(certification);
});

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }

  // Check if the certification belongs to the user
  if (certification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedCertification = await Certification.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedCertification);
});

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private
const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }

  // Check if user owns the certification
  if (certification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Delete the certificate file if it exists
  if (certification.certificateFile) {
<<<<<<< Updated upstream
    const filePath = path.join(__dirname, '../uploads', certification.certificateFile);
    if (fs.access(filePath)) {
      await fs.unlink(filePath);
=======
    const filePath = path.join(__dirname, '..', 'uploads', certification.certificateFile);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted certificate file:', filePath);
      }
    } catch (error) {
      console.error('Error deleting certificate file:', error);
>>>>>>> Stashed changes
    }
  }

  // Remove certification from user's certifications array
  const user = await User.findById(req.user._id);
  user.certifications = user.certifications.filter(
    certId => certId.toString() !== certification._id.toString()
  );
  await user.save();

  // Delete the certification
  await certification.deleteOne();

  res.json({ message: 'Certification removed' });
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
// @desc    Analyze certificate file
=======
// @desc    Analyze a certificate
>>>>>>> Stashed changes
// @route   POST /api/certifications/analyze
// @access  Private
const analyzeCertificationHandler = asyncHandler(async (req, res) => {
  try {
<<<<<<< Updated upstream
    console.log('Starting certificate analysis...');
    
    // Check if file was uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Log file details
    console.log('File details:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0
    });

<<<<<<< Updated upstream
    // Get user input from request body
    const { title, issuer, issueDate, credentialId } = req.body;
    console.log('User input:', { title, issuer, issueDate, credentialId });

    // Test Gemini connection before proceeding
    try {
      await testConnection();
      console.log('Gemini AI connection test passed');
    } catch (geminiError) {
      console.error('Gemini AI connection test failed:', geminiError);
      return res.status(500).json({ 
        message: 'Error connecting to Gemini AI',
        error: geminiError.message
      });
    }

    // Determine file type
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
    console.log('File type determined:', fileType);
=======
    // Validate file type
    if (!req.file.mimetype.startsWith('image/') && req.file.mimetype !== 'application/pdf') {
      console.error('Invalid file type:', req.file.mimetype);
      return res.status(400).json({ 
        message: 'Invalid file type. Please upload a PDF or image file (JPEG, PNG)' 
      });
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      console.error('File too large:', req.file.size);
      return res.status(400).json({ 
        message: `File size (${(req.file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 5MB` 
      });
    }

    // Get file type for analysis
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';

    // Extract user input from request body
    const userInput = {
      title: req.body.title || '',
      issuer: req.body.issuer || '',
      issueDate: req.body.issueDate || '',
      credentialId: req.body.credentialId || ''
    };
>>>>>>> Stashed changes

    // Analyze the certificate
    const analysis = await analyzeCertificate(req.file.buffer, fileType, userInput);
    console.log('Certificate analysis completed');

    // Validate authenticity
    const authenticity = await validateCertificateAuthenticity(analysis);
    console.log('Authenticity validation completed');

    // Extract skills
    const extractedSkills = await extractSkillsFromCertificate(analysis);
    console.log('Skills extracted:', extractedSkills);

    // Send response
    res.json({
      analysis,
      authenticity,
      extractedSkills
    });

  } catch (error) {
    console.error('Error in analyzeCertificationFile:', error);
    res.status(500).json({ 
      message: error.message || 'Error analyzing certificate',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
=======
    const { title, issuer, issueDate, credentialId } = req.body;
    
    // Validate required fields
    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ message: 'Title, issuer, and issue date are required' });
    }

    let aiAnalysis = null;
    let authenticity = null;
    let extractedSkills = [];

    // If a certificate file is uploaded, analyze it
    if (req.file) {
      try {
        // Determine file type
        const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
        
        // Analyze certificate
        aiAnalysis = await analyzeCertificate(
          req.file.buffer,
          fileType,
          { title, issuer, issueDate, credentialId }
        );

        // Validate authenticity
        authenticity = await validateCertificateAuthenticity(aiAnalysis);
        
        // If there are major discrepancies, flag them but don't fail
        if (authenticity.authenticity_score < 0.5) {
          console.log('Warning: Low certificate authenticity score:', authenticity.authenticity_score);
          if (!authenticity.flags) authenticity.flags = [];
          authenticity.flags.push('Low authentication score, but you can still proceed');
        }
      } catch (error) {
        console.error('AI Analysis Error:', error);
      }
    } else {
      // No file uploaded, create a basic analysis and a default authenticity score
      console.log('No certificate file uploaded, using default values');
      
      aiAnalysis = {
        extracted_info: {
          title: title || "",
          issuer: issuer || "",
          issue_date: issueDate || "",
          credential_id: credentialId || ""
        },
        validation: {
          matches: [],
          discrepancies: []
        },
        suggested_skills: [],
        category: ""
      };
      
      authenticity = {
        authenticity_score: 0.1, // Low default score
        confidence_level: "low",
        flags: ["Manual entry without certificate file"],
        recommendations: ["Consider uploading a certificate file for verification"]
      };
    }

    // Extract skills from certificate information
    try {
      extractedSkills = await extractSkillsFromCertificate({
        title,
        issuer,
        description: req.body.description || '',
        aiAnalysis
      });
    } catch (error) {
      console.error('Skill Extraction Error:', error);
      extractedSkills = [];
    }

    res.json({
      analysis: aiAnalysis,
      extractedSkills,
      authenticity
>>>>>>> Stashed changes
    });
  } catch (error) {
    console.error('Error analyzing certificate:', error);
    res.status(500).json({ error: error.message });
  }
});

>>>>>>> Stashed changes
module.exports = {
  getCertifications,
  getCertification,
  addCertification,
  updateCertification,
  deleteCertification,
<<<<<<< Updated upstream
=======
  analyzeCertificationHandler,
>>>>>>> Stashed changes
  upload
}; 