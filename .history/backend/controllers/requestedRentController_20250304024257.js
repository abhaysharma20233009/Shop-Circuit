const { RequestedRent} = require('../models/requestedRent.model.js');

// Create a new rent request
exports.createRentRequest = async (req, res) => {
  try {
    console.log(req.body);
    const rentRequest = await RequestedRent.create({ ...req.body, student: req.body.studentId });
    res.status(201).json({ success: true, data: rentRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 
// Get all rent requests
exports.getAllRentRequests = async (req, res) => {
  try {
    const rentRequests = await RequestedRent.find().populate('studentId', 'username email');
    res.status(200).json({ success: true, data: rentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Approve or Reject a Rent Request
exports.updateRentRequestStatus = async (req, res) => {
  try {
    const rentRequest = await RequestedRent.findByIdAndUpdate(req.params.id);
    const newRequest=req.body;
          rentRequest.status=req.body.status; 
          rentRequest=newRequest;
          await rentRequest.save();
       
    if (!rentRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, data: rentRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

