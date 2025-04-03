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
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.73.45:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profiles', profileComparisonRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
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