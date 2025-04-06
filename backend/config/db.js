const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< Updated upstream
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
=======
    // Set up connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Connect directly to the database
    const conn = await mongoose.connect(process.env.MONGODB_URI + '/skill_tracker', options);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    console.log('Successfully connected to MongoDB');
    return conn;
>>>>>>> Stashed changes
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process, let the application handle the error
    throw error;
  }
};

module.exports = connectDB; 