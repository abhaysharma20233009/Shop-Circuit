const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "sent", "edited", "seen"],
        default: "pending",
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastMessageTimestamp: { type: Date, default: null }, // ✅ New field for sorting
});

// Middleware to update lastMessageTimestamp
chatMessageSchema.pre("save", function (next) {
  if (this.messages.length > 0) {
    this.lastMessageTimestamp =
      this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
module.exports = ChatMessage;
