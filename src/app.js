// src/app.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/items');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request details when it starts
  console.log(`[${timestamp}] 🔵 New Request:`);
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.url}`);
  console.log(`  Headers:`, req.headers);
  console.log(`  Body:`, req.body);
  
  // Override res.end to log when request completes
  const oldEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] 🟢 Request Completed:`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  URL: ${req.url}`);
    console.log('----------------------------------------');
    
    oldEnd.apply(res, args);
  };
  
  // Log any errors
  res.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] 🔴 Error:`);
    console.error(`  URL: ${req.url}`);
    console.error(`  Error: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
  });
  
  next();
});

// Connect to MongoDB with logging
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/items', itemRoutes);

// Health check endpoint with logging
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] 💚 Health check requested`);
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] 🔴 Error:`);
  console.error(`  URL: ${req.url}`);
  console.error(`  Error: ${err.message}`);
  console.error(`  Stack: ${err.stack}`);
  
  res.status(500).json({ error: err.message });
});

// Export the serverless handler
module.exports.handler = serverless(app);