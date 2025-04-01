const { RequestedRent} = require('../models/requestedRent.model.js');
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
// Create a new rent request
exports.createRentRequest = async (req, res) => {
  try {
    console.log("bodyyyy " + req.body.itemName); // Fixed syntax
    console.log(req.user);
    const studentId = req.user ? req.user._id : req.body.studentId; // Use user ID if available
    console.log("studentId " + studentId);

    const rentRequest = await RequestedRent.create({ 
      ...req.body, 
      student: studentId // Assign correct student ID
    });

    res.status(201).json({ status: 'success', data: rentRequest });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Get all rent requests

exports.getAllRentRequests = catchAsync(async (req, res, next) => {
  
  
  const rentRequests = await RequestedRent.find().populate('studentId', 'username email hostelName roomNumber contactNumber');
  res.status(200).json({ status: 'success', data: rentRequests });
});




// Approve or Reject a Rent Request
exports.updateRentRequestStatus = async (req, res) => {
  try {
   
    const newRequest=req.body;
    const rentRequest = await RequestedRent.findByIdAndUpdate(req.params.id, newRequest, {
      new: true,
    });
  
          rentRequest.status=req.body.status; 
          
          await rentRequest.save();
       
    if (!rentRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ status: 'success', data: rentRequest });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

