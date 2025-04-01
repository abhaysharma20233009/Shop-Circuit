const  ContactQuery =require( "../models/contactQueryModel.js");
const User = require("../models/userModel.js");
const Notification=require("../models/notificationModel.js")
// Create a new contact query
exports.createQuery = async (req, res) => {
  try {
    
    const id=req.user._id;
    const user=await User.findById(id);
    console.log(user+"user"+user.username);
    const { message } = req.body;
    const newQuery = await ContactQuery.create({ name:user.username, email:user.email, message });
    const admin = await User.findOne({ role: "admin" }); 
     const recipientId = admin._id;
        const senderId = req.user._id;
        const content = message;
    
        const newNotification = new Notification({
          receiver: recipientId,
          sender: senderId,
          messagePreview: content,
          isRead: false,
        });
        await newNotification.save();
        try {
          if (io) {
            io.to(`${recipientId}`).emit("newMessageNotification", {
              sender: senderId,
              messagePreview: content,
              timestamp: Date.now(),
            });
          } else {
            console.error("Socket.io is not initialized.");
          }
        } catch (error) {
          console.error("Error saving notification:", error);
        } 
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact query" });
  }
};

// Get all contact queries (Admin Only)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact queries" });
  }
};


exports.deleteContactQuery = async (req, res) => {
    try {
      const { id } = req.params;
  
      const query = await ContactQuery.findById(id);
      if (!query) {
        return res.status(404).json({ message: "Query not found" });
      }
  
      await ContactQuery.findByIdAndDelete(id);
      res.status(200).json({ message: "Query deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Get a single query by ID
exports.getQueryById = async (req, res) => {
  try {
    const query = await ContactQuery.findById(req.params.id);
    if (!query) return res.status(404).json({ error: "Query not found" });
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch query" });
  }
};

// Update query status
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedQuery = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedQuery) return res.status(404).json({ error: "Query not found" });
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to update query status" });
  }
};
