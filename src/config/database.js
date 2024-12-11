// src/config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 Attempting to connect to MongoDB...`);
  console.log(`[${timestamp}] 🔑 Using connection string:`, MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[${timestamp}] ✅ MongoDB connected successfully`);
    
    // Log connection details
    const state = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log(`[${timestamp}] 📊 Connection state: ${statusMap[state]}`);

    // Set up connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.log(`[${new Date().toISOString()}] ❌ MongoDB disconnected`);
    });

    mongoose.connection.on('reconnected', () => {
      console.log(`[${new Date().toISOString()}] 🔄 MongoDB reconnected`);
    });

  } catch (error) {
    console.error(`[${timestamp}] ❌ MongoDB connection error:`, error.message);
    console.error(`[${timestamp}] 📜 Stack trace:`, error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;