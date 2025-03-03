const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.createProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndDelete(req.params.id).exec();

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
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
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  let query = Product.findById(req.params.id);
  if (req.popOptions) query = query.populate(req.popOptions);
  const doc = await query.exec();

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  let filter = {};

  // List of valid categories (without "all")
  const validCategories = [
    "stationary",
    "vehicle",
    "fashion",
    "grocery",
    "electronics",
    "food",
  ];

  // Check if a category filter is provided
  if (req.query.category) {
    const category = req.query.category.toLowerCase();

    if (!validCategories.includes(category)) {
      return next(new AppError("Invalid category provided", 400));
    }

    // Apply category filter
    filter.category = category;
  }

  const features = new APIFeatures(Product.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query.exec();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.params; // Get category from URL

  // Define valid categories (without "all")
  const validCategories = [
    "stationary",
    "vehicle",
    "fashion",
    "grocery",
    "electronics",
    "food",
  ];

  // Check if category is valid
  if (!validCategories.includes(categoryName.toLowerCase())) {
    return next(new AppError("Invalid category provided", 400));
  }

  // Fetch products by category
  const products = await Product.find({ category: categoryName.toLowerCase() });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});