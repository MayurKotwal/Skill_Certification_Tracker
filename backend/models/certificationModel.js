const mongoose = require('mongoose');

const certificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  issuer: {
    type: String,
    required: [true, 'Please add an issuer']
  },
  issueDate: {
    type: Date,
    required: [true, 'Please add an issue date']
  },
  credentialId: {
    type: String
  },
  credentialUrl: {
    type: String
  },
  description: {
    type: String
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  certificateFile: {
    type: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certification', certificationSchema); 