const { RequestedRent } = require("../models/requestedRentModel.js");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const Notification = require("../models/notificationModel.js");

// Create a new rent request
exports.createRentRequest = async (req, res) => {
  try {
    const studentId = req.user ? req.user._id : req.body.studentId; // Use user ID if available

    const rentRequest = await RequestedRent.create({
      ...req.body,
      studentId: studentId, // Assign correct student ID
    });
    res.status(201).json({ status: "success", data: rentRequest });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get all rent requests

exports.getUserRentRequests = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const rentRequests = await RequestedRent.find({ studentId: userId });
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
    const rentRequest = await RequestedRent.findById(requestId);
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

// Rents for admin

exports.getAllPendingRequestsForAdmin = catchAsync(async (req, res, next) => {
  const rentRequests = await RequestedRent.find({ status: "pending" }) // Filter only pending requests
    .populate(
      "studentId",
      "username email hostelName roomNumber contactNumber profilePicture"
    );

  res.status(200).json({
    status: "success",
    results: rentRequests.length,
    data: rentRequests,
  });
});

exports.deletePendingRequestAsAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Extract rent request ID from URL params

  const deletedRequest = await RequestedRent.findByIdAndDelete(id);

  if (!deletedRequest) {
    return res.status(404).json({
      status: "fail",
      message: "Requested rent not found",
    });
  }

  // Create notification
  const recipientId = deletedRequest.studentId;
  const senderId = req.user._id;
  const content = `Your product ${deletedRequest.itemName} is deleted by admin`;
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
  res.status(200).json({
    status: "success",
    message: "Requested rent deleted successfully",
    data: deletedRequest,
  });
});
