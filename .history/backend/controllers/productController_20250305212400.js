const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs=require('fs');


const upload = multer({ dest: "uploads/" });


exports.createProduct = catchAsync(async (req, res, next) => {
  console.log("Received Data:", req.body);
  console.log("User Info:", req.user);

  const { productName, price, noOfItems, description, sellerType, category } = req.body;
  let productImage = null;
  upload.single('image')(req, res, async (err) => {
    console.log("hiimages");
    if (err) return next(new AppError('Error uploading file', 400));

    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }
  
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Delete the file from temporary storage after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      productImage = result.secure_url;
  });
  // Create and save product
  const newProduct = await Product.create({
    productName,
    price,
    numberOfItems,
    description,
    sellerType,
    category,
    productImage,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully!",
    data: newProduct,
  })
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndDelete(req.params.id).exec();

  if (!doc) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
  let filter = {};
  if (req.query.sellerId) filter.sellerId = req.query.sellerId;

  const validCategories = ["stationary", "vehicle", "fashion", "grocery", "electronics", "food"];
  if (req.query.category && !validCategories.includes(req.query.category.toLowerCase())) {
    return next(new AppError("Invalid category provided", 400));
  }
  if (req.query.category) filter.category = req.query.category.toLowerCase();

  const features = new APIFeatures(
    Product.find(filter).populate("sellerId", "shopName shopAddress contactNumber sellerType"),
    req.query
  ).filter().sort().limitFields().paginate();

  const products = await features.query.exec();
  const productsWithSellers = products
  .filter(product => product.sellerType === "shopkeeper") // Filter only shopkeepers
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
