const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController.js');
const { protect } = require('../controllers/authController.js');

// Route to get all notifications for a user
router.get('/', protect, getNotifications);  

// Route to mark a specific notification as read
router.put('/:id/read', protect, markNotificationAsRead);  

module.exports = router;
