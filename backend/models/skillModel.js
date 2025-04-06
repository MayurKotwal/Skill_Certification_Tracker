const mongoose = require('mongoose');

const skillSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'],
    },
    proficiencyLevel: {
      type: String,
      required: [true, 'Please add proficiency level'],
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    projects: [{
      name: String,
      description: String,
      url: String,
    }],
    endorsements: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema); 