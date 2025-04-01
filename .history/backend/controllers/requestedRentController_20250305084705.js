const { RequestedRent} = require('../models/requestedRent.model.js');
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
// Create a new rent request
exports.createRentRequest = async (req, res) => {
  try {
    console.log(req.body);
    const rentRequest = await RequestedRent.create({ ...req.body, student: req.body.studentId });
    res.status(201).json({ status: 'success', data: rentRequest });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
 
// Get all rent requests
exports.getAllRentRequests = async (req, res) => {
  try {
    const rentRequests = await RequestedRent.find().populate('studentId', 'username email');
    res.status(200).json({ status: 'success', data: rentRequests });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};
exports.getAllStudentSells = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query.sellerId) filter.sellerId = req.query.sellerId;

  const validCategories = ["stationary", "vehicle", "fashion", "grocery", "electronics", "food"];
  if (req.query.category && !validCategories.includes(req.query.category.toLowerCase())) {
    return next(new AppError("Invalid category provided", 400));
  }
  if (req.query.category) filter.category = req.query.category.toLowerCase();

  const features = new APIFeatures(
    Product.find(filter).populate("sellerId", "username contactNumber hostelName roomNumber sellerType"),
    req.query
  ).filter().sort().limitFields().paginate();

  const products = await features.query.exec();
  const productsWithSellers = products
  .filter(product => product.sellerType === "student") // Filter only shopkeepers
  .map(product => {
    const productData = { ...product.toObject() };
    return productData;
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: productsWithSellers,
    },
  });
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

