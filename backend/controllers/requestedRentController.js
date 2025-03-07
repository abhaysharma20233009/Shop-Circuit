const { RequestedRent} = require('../models/requestedRent.model.js');

// Create a new rent request
exports.createRentRequest = async (req, res) => {
  try {
    const rentRequest = await RequestedRent.create({ ...req.body, student: req.user._id });
    res.status(201).json({ success: true, data: rentRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all rent requests
exports.getAllRentRequests = async (req, res) => {
  try {
    const rentRequests = await RequestedRent.find().populate('student', 'username email');
    res.status(200).json({ success: true, data: rentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Approve or Reject a Rent Request
exports.updateRentRequestStatus = async (req, res) => {
  try {
    const rentRequest = await RequestedRent.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!rentRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, data: rentRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

