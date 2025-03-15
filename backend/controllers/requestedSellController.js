const {RequestedSell } = require('../models/requestedSell.model.js');


// Create a new sell request
exports.createSellRequest = async (req, res) => {
  try {
    const sellRequest = await RequestedSell.create({ ...req.body, student: req.user._id });
    res.status(201).json({ success: true, data: sellRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all sell requests
exports.getAllSellRequests = async (req, res) => {
  try {
    const sellRequests = await RequestedSell.find().populate('student', 'username email');
    res.status(200).json({ success: true, data: sellRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Approve or pendding a Sell Request
exports.updateSellRequestStatus = async (req, res) => {
  try {
    const sellRequest = await RequestedSell.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, data: sellRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
