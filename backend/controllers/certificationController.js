const Certification = require('../models/certificationModel');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Initialize GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Configure multer for GridFS storage
const storage = multer.memoryStorage();

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

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private
const createCertification = asyncHandler(async (req, res) => {
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, description } = req.body;

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
    credentialUrl,
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

  await certification.remove();
  res.json({ message: 'Certification removed' });
});

// @desc    Add a new certification
// @route   POST /api/certifications
// @access  Private
const addCertification = async (req, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, description } = req.body;
    
    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ message: 'Please provide title, issuer, and issue date' });
    }

    let fileId = null;
    if (req.file) {
      // Create a write stream to GridFS
      const writeStream = gfs.createWriteStream({
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      // Write the file buffer to GridFS
      writeStream.write(req.file.buffer);
      writeStream.end();

      // Get the file ID after writing
      fileId = await new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve(writeStream.id);
        });
        writeStream.on('error', reject);
      });
    }

    // Create certification
    const certification = await Certification.create({
      user: req.user._id,
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      description,
      certificateFile: fileId
    });

    // Add certification to user's certifications array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { certifications: certification._id } },
      { new: true }
    );

    res.status(201).json(certification);
  } catch (error) {
    console.error('Error in addCertification:', error);
    res.status(400).json({ 
      message: 'Error adding certification',
      error: error.message 
    });
  }
};

// @desc    Get certification file
// @route   GET /api/certifications/file/:id
// @access  Private
const getCertificationFile = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set the appropriate content type
    res.set('Content-Type', file.contentType);
    
    // Create read stream and pipe to response
    const readStream = gfs.createReadStream({ _id: file._id });
    readStream.pipe(res);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
};

module.exports = {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  upload,
  addCertification,
  getCertificationFile
}; 