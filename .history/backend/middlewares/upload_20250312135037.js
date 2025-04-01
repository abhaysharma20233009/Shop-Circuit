const multer = require("multer");

// Set up Multer to store file in memory (not on disk)
const storage = multer.memoryStorage();

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
  storage: storage,  // Store the file in memory
  fileFilter: fileFilter,
});

module.exports = upload;
