const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver of the notification
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Sender
    messagePreview: { type: String, required: true }, // Short preview of the message
    
    isRead: { type: Boolean, default: false }, // Read/Unread status
    timestamp: { type: Date, default: Date.now },
  },
  
);

module.exports = mongoose.model("Notification", notificationSchema);
