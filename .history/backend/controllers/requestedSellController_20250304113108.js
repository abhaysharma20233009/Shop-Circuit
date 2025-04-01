const {RequestedSell } = require('../models/requestedSell.model.js');


// Create a new sell request
exports.createSellRequest = async (req, res) => {
  try {
    const sellRequest = await RequestedSell.create({ ...req.body, student: req.body.studentId });
    res.status(201).json({ success: true, data: sellRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all sell requests
exports.getAllSellRequests = async (req, res) => {
  try {
    const sellRequests = await RequestedSell.find().populate('studentId', 'username email');
    res.status(200).json({ status:'success', data: sellRequests });
  } catch (error) {
    res.status(500).json({ status:'fail', message: error.message });
  }
};



// Approve or pendding a Sell Request
exports.updateSellRequestStatus = async (req, res) => {
  try {
    const newSell=req.body;
    const sellRequest = await RequestedSell.findByIdAndUpdate(req.params.id, newSell, { new: true });
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    sellRequest.status=newSell.status;
    await sellRequest.save();
    res.status(200).json({ success: true, data: sellRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
