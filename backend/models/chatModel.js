const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  //define a unique roomId fro two user's conversation
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
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
module.exports = ChatMessage;
