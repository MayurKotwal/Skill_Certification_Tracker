const mongoose = require('mongoose');

const certificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add certification name'],
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Please add issuing organization'],
    },
    credentialID: {
      type: String,
      required: [true, 'Please add credential ID'],
    },
    issueDate: {
      type: Date,
      required: [true, 'Please add issue date'],
    },
    expiryDate: {
      type: Date,
    },
    credentialURL: {
      type: String,
      required: [true, 'Please add credential URL'],
    },
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    }],
    certificateImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
    },
    description: {
      type: String,
    },
  },
<<<<<<< Updated upstream
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
  expiryDate: {
    type: Date
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
=======
  {
    timestamps: true,
>>>>>>> Stashed changes
  }
);

module.exports = mongoose.model('Certification', certificationSchema); 