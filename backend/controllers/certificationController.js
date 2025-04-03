const Certification = require('../models/certificationModel');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const fs = require('fs');

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

  if (!title || !issuer || !issueDate) {
    res.status(400);
    throw new Error('Please provide title, issuer, and issue date');
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
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

module.exports = {
  getCertifications,
  getCertification,
  addCertification,
  updateCertification,
  deleteCertification,
  upload
}; 