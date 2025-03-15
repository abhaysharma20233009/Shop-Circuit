const express = require("express");
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

// Get all messages between two users
router.get("/:senderId/:recipientId", chatController.getAllMessages);

// Create a new message; if using multer, add upload.single('file') as middleware
router.post("/send/:recipientId", /* upload.single('file'), */ chatController.createMessage);

// Update and delete routes if needed:
router.put("/:recipientId/:messageId", chatController.updateMessage);
router.delete("/:recipientId/:messageId", chatController.deleteMessage);

// // Send Message (Text or File)
// router.post("/send", chatController.sendMessage);

// // Get Messages
// router.get("/:senderId/:recipientId", chatController.getMessages);

// // Get Unread Messages Count
// router.get("/unread/:userId", chatController.getUnreadCount);

module.exports = router;
