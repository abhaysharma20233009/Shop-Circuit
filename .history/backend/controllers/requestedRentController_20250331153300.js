const { RequestedRent } = require("../models/requestedRentModel.js");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
// Create a new rent request
exports.createRentRequest = async (req, res) => {
  console.log("bodyyyy " + req.body.itemName); // Fixed syntax
  console.log(req.user);
  try {
    const studentId = req.user ? req.user._id : req.body.studentId; // Use user ID if available
    console.log("studentId " + studentId);

    const rentRequest = await RequestedRent.create({
      ...req.body,
      studentId: studentId, // Assign correct student ID
    });
    console.log("rentreq" + rentRequest);
    res.status(201).json({ status: "success", data: rentRequest });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get all rent requests

exports.getUserRentRequests = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const rentRequests = await RequestedRent.find({ studentId: userId });
  console.log(rentRequests);
  res.status(200).json({ status: "success", data: rentRequests });
});

exports.getAllPendingRequests = catchAsync(async (req, res, next) => {
  const rentRequests = await RequestedRent.find({ status: "pending" }) // Filter only pending requests
    .populate(
      "studentId",
      "username email hostelName roomNumber contactNumber profilePicture"
    );

  res.status(200).json({ status: "success", data: rentRequests });
});

// Approve or Reject a Rent Request
exports.markFulfilledRentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(requestId);
    const rentRequest = await RequestedRent.findById(requestId);
    console.log();
    if (!rentRequest) {
      return res.status(404).json({ message: "Rent request not found" });
    }

    rentRequest.status = "fulfilled";
    await rentRequest.save();

    res.status(200).json({ message: "Rent request marked fulfilled" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking fulfilled the requested rent", error });
  }
};


exports.updateRentRequest=catchAsync(async (req,res,next) => {
  const doc = await   RequestedRent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).exec();

  if (!doc) {
    return next(new AppError("No Rent Request found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: doc,
    },
  });
})
exports.deleteRentRequest=catchAsync(async (req,res,next) => {
  console.log("req.params"+req.params.id);
 const doc=RequestedRent.findByIdAndDelete(req.params.id);
 console.log(doc);

  if (!doc) {
    return next(new AppError("No Rent Request found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: doc,
    },
  });
})