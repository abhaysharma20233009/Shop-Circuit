const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// Load environment variables first
dotenv.config();

// Route imports
const rentRoutes = require("./routes/requestedRentRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Error handling
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// Initialize Express app
const app = express();

// Configure Cloudinary securely from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware setup
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

// Logging middleware (optional: replace with morgan in production)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rent", rentRoutes);
app.use("/api/v1/admin", adminRoutes);

// Serve frontend (for full-stack deployment)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  }
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
