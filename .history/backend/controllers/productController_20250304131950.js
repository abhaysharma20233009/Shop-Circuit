const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body.sellerId) {
    return next(new AppError("A product must have a seller ID", 400));
  }

  try {
    const doc = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: doc,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Extract the duplicate key field (e.g., productName)
      const field = Object.keys(error.keyValue)[0]; // Gets the duplicate field name
      const value = error.keyValue[field]; // Gets the duplicate value

      return next(new AppError(`Duplicate field value: ${value}. Please use another value!`, 400));
    }
    return next(error);
  }
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
    Product.find(filter).populate("sellerId", "shopName shopAddress hostelName roomNumber sellerType"),
    req.query
  ).filter().sort().limitFields().paginate();

  const products = await features.query.exec();
  const productsWithSellers = products.map(product => {
    const productData = { ...product.toObject() };
  
    if (product.sellerId?.sellerType === "shopkeeper") {
      productData.sellerDetails = {
        shopName: product.sellerId.shopName,
        shopAddress: product.sellerId.shopAddress,
      };
    }
  
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
