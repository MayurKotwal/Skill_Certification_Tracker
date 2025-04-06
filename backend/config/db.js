const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in newer versions of Mongoose
      // but adding them for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for our collections
    await Promise.all([
      conn.connection.collection('users').createIndex({ email: 1 }, { unique: true }),
      conn.connection.collection('skills').createIndex({ user: 1, name: 1 }),
      conn.connection.collection('certifications').createIndex({ user: 1, credentialID: 1 }),
      conn.connection.collection('profiles').createIndex({ user: 1 }, { unique: true })
    ]);

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 