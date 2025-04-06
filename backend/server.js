const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const skillRoutes = require('./routes/skillRoutes');
const profileComparisonRoutes = require('./routes/profileComparisonRoutes');
const fs = require('fs');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Express app
const app = express();

// Connect to MongoDB with retry logic
const initializeMongoDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await connectDB();
      break;
    } catch (error) {
      retries -= 1;
      console.log(`MongoDB connection failed. Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Could not connect to MongoDB. Exiting...');
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Initialize MongoDB connection
initializeMongoDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.73.45:3000'], // Default origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
}

// Serve static files from uploads directory with proper MIME types
app.use('/uploads', (req, res, next) => {
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
      } else if (path.match(/\.(jpg|jpeg)$/i)) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.match(/\.png$/i)) {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  })(req, res, next);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profiles', profileComparisonRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;
console.log('Environment variables:', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 