const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs=require('fs');


exports.createProduct = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("User Info:", req.user);
    console.log("Received File:", req.file);

    const { productName, price, noOfItems, description, sellerType, category } = req.body;

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    // Store Cloudinary URL

    const productImage = result.secure_url;
    const sellerId = req.user._id;

    // Create and save product
    const newProduct = await Product.create({
      productName,
      price,
      noOfItems,
      description,
      sellerType,
      category,
      productImage,
      sellerId,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).exec();

  if (!doc) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: doc,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "sellerId",
    "shopName shopAddress hostelName roomNumber sellerType"
  );

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  const seller = product.sellerId;
  const sellerDetails = seller.sellerType === "shopkeeper"
    ? { shopName: seller.shopName, shopAddress: seller.shopAddress }
    : { hostelName: seller.hostelName, roomNumber: seller.roomNumber };

  res.status(200).json({
    status: "success",
    data: {
      product,
      sellerDetails,
    },
  });
});
exports.getAllProducts = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.find({ status: "pending" }).populate("sellerId", "shopName shopAddress contactNumber sellerType").exec();
    
    console.log("Fetched products:", products); // Debug log

    const productsWithSellers = products
      .filter(product => product.sellerType && product.sellerType.toLowerCase() === "shopkeeper") // Prevents crash if sellerId is null
      .map(product => ({ ...product.toObject() }));

    res.status(200).json({
      status: "success",
      results: productsWithSellers.length,
      data: { products: productsWithSellers },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch products", error });
  }
});

exports.getUserSells = catchAsync(async (req, res, next) => {
  const userId=req.user._id;

  const rentRequests = await Product.find({ studentId: userId}) 
  console.log(rentRequests);
  res.status(200).json({ status: 'success', data: rentRequests });
});


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



exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.params;
  const validCategories = ["stationary", "vehicle", "fashion", "grocery", "electronics", "food"];

  if (!validCategories.includes(categoryName.toLowerCase())) {
    return next(new AppError("Invalid category provided", 400));
  }

  const products = await Product.find({ category: categoryName.toLowerCase() });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});
