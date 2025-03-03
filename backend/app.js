const express = require('express');
const cookieParser=require('cookie-parser')
const dotenv = require('dotenv');
const rentRoutes = require('./routes/requestedRentRoute');
const sellRoutes = require('./routes/requestedSellRoute');

const userRouter = require('./routes/userRoutes');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Initialize Express app
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Adjust based on frontend URL
  credentials: true, // Allows cookies to be sent with requests
}));

// Load environment variables
dotenv.config();

// Use cookie-parser middleware
app.use(cookieParser());

// Body parser middleware to read data from body into req.body
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Body:", req.body); // Check if body is undefined
  next();
});

app.use("/api/v1", productRouter);

app.use('/api/v1/users', userRouter);

// 🌟 Routes
//app.use('/api/v1/users', userRouter);

app.use('/api/v1/rent', rentRoutes);
app.use('/api/v1/sell', sellRoutes);


// 404 handler for undefined routes
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);


module.exports = app;  // Export app for use in the server setup

