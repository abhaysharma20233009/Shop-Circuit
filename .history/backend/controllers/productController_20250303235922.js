const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const User = require("../models/userModel");
exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body.sellerId) {
    return next(new AppError("A product must have a seller ID", 400));
  }
  const doc = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: doc,
    },
  });
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
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  // Fetch seller details manually
  const seller = await User.findById(product.sellerId);
  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  // Attach seller details based on seller type
  const sellerDetails =
    seller.sellerType === "shopkeeper"
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
  if (req.query.sellerId) {
    filter.sellerId = req.query.sellerId;
  }

  const validCategories = ["stationary", "vehicle", "fashion", "grocery", "electronics", "food"];
  if (req.query.category) {
    const category = req.query.category.toLowerCase();
    if (!validCategories.includes(category)) {
      return next(new AppError("Invalid category provided", 400));
    }
    filter.category = category;
  }

  const features = new APIFeatures(Product.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query.exec();

  // Fetch seller details for each product
  const productsWithSellers = await Promise.all(
    products.map(async (product) => {
      const seller = await User.findById(product.sellerId);
      console.log(seller);
      return {
        ...product.toObject(),
        sellerDetails: seller
          ? product.sellerType === "shopkeeper"
            ? { shopName: seller.shopName, shopAddress: seller.shopAddress }
            : { hostelName: seller.hostelName, roomNumber: seller.roomNumber }
          : null,
      };
    })
  );

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