const multer = require("multer");
const path = require("path");

// Set up Multer storage (temporary, as we upload to Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads/" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File filter: Only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Set up Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
