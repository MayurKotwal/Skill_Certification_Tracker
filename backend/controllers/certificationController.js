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
const { testConnection } = require('../config/geminiConfig');
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
  if (!title || !issuer || !issueDate) {
    res.status(400);
    throw new Error('Please provide title, issuer, and issue date');
=======
    let aiAnalysis = null;
    let authenticity = null;
    let extractedSkills = [];
    let certificateFile = null;

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
      } : undefined
    });

    await certification.save();

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

  // Check if the certification belongs to the user
  if (certification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Delete the certification file if it exists
  if (certification.certificateFile) {
    const filePath = path.join(__dirname, '../uploads', certification.certificateFile);
    if (fs.access(filePath)) {
      await fs.unlink(filePath);
    }
  }

  // Remove the certification from the user's certifications array
  const user = await User.findById(req.user._id);
  if (user) {
    user.certifications = user.certifications.filter(
      cert => cert.toString() !== certification._id.toString()
    );
    await user.save();
  }

  await certification.remove();
  res.json({ message: 'Certification removed' });
});

<<<<<<< Updated upstream
=======
// @desc    Analyze certificate file
// @route   POST /api/certifications/analyze
// @access  Private
const analyzeCertificationFile = asyncHandler(async (req, res) => {
  try {
    console.log('Starting certificate analysis...');
    console.log('Request headers:', req.headers);
    
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

    try {
      // Analyze certificate
      console.log('Starting certificate analysis...');
      const aiAnalysis = await analyzeCertificate(
        req.file.buffer,
        fileType,
        { title, issuer, issueDate, credentialId }
      );
      console.log('AI Analysis completed:', JSON.stringify(aiAnalysis, null, 2));

      // Validate authenticity
      console.log('Starting authenticity validation...');
      const authenticity = await validateCertificateAuthenticity(aiAnalysis);
      console.log('Authenticity validation completed:', JSON.stringify(authenticity, null, 2));

      // Extract skills
      console.log('Starting skill extraction...');
      const extractedSkills = await extractSkillsFromCertificate({
        title: title || aiAnalysis.extracted_info.title,
        issuer: issuer || aiAnalysis.extracted_info.issuer,
        description: req.body.description,
        aiAnalysis
      });
      console.log('Skills extracted:', JSON.stringify(extractedSkills, null, 2));

      res.json({
        analysis: aiAnalysis,
        authenticity,
        extractedSkills,
        message: 'Certificate analyzed successfully'
      });
    } catch (analysisError) {
      console.error('Error during analysis process:', analysisError);
      console.error('Analysis error stack:', analysisError.stack);
      return res.status(500).json({ 
        message: 'Error analyzing certificate',
        error: analysisError.message,
        stack: process.env.NODE_ENV === 'development' ? analysisError.stack : undefined
      });
    }
  } catch (error) {
    console.error('Error in analyzeCertificationFile:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error analyzing certificate',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

>>>>>>> Stashed changes
module.exports = {
  getCertifications,
  getCertification,
  addCertification,
  updateCertification,
  deleteCertification,
  upload
}; 