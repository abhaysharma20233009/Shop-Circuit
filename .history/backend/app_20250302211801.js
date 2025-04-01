const express = require('express');

const dotenv = require('dotenv');
const globalErrorHandler = require('./controllers/errorController');



// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Use cookie-parser middleware
app.use(cookieParser());

// Body parser middleware to read data from body into req.body
app.use(express.json({ limit: '10kb' }));

// 404 handler for undefined routes
app.use('*', (req, res, next) => {
  next();
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;  // Export app for use in the server setup
