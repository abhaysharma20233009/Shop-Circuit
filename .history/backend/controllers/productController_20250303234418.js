const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

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
  const product = await Product.findById(req.params.id)
    .populate({
      path: "sellerId",
      select: "sellerType shopName shopAddress hostelName roomNumber",
    })
    .exec();

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: {
        ...product.toObject(),
        sellerDetails:
          product.sellerId.sellerType === "shopkeeper"
            ? { shopName: product.sellerId.shopName, shopAddress: product.sellerId.shopAddress }
            : { hostelName: product.sellerId.hostelName, roomNumber: product.sellerId.roomNumber },
      },
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

  const products = await features.query.populate({
    path: "sellerId",
    select: "sellerType shopName shopAddress hostelName roomNumber",
  }).exec();

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: products.map((product) => ({
        ...product.toObject(),
        sellerDetails:
          product.sellerId.sellerType === "shopkeeper"
            ? { shopName: product.sellerId.shopName, shopAddress: product.sellerId.shopAddress }
            : { hostelName: product.sellerId.hostelName, roomNumber: product.sellerId.roomNumber },
      })),
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