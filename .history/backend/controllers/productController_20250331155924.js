const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const { productName, price, noOfItems, description, sellerType, category } =
      req.body;

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

// exports.getProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id).populate(
//     "sellerId",
//     "shopName shopAddress hostelName roomNumber sellerType"
//   );

//   if (!product) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   const seller = product.sellerId;
//   const sellerDetails = seller.sellerType === "shopkeeper"
//     ? { shopName: seller.shopName, shopAddress: seller.shopAddress }
//     : { hostelName: seller.hostelName, roomNumber: seller.roomNumber };

//   res.status(200).json({
//     status: "success",
//     data: {
//       product,
//       sellerDetails,
//     },
//   });
// });
exports.getAllShopProducts = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.find({ status: "pending" })
      .populate("sellerId", "shopName shopAddress contactNumber sellerType")
      .exec();

    const productsWithSellers = products
      .filter(
        (product) =>
          product.sellerType &&
          product.sellerType.toLowerCase() === "shopkeeper"
      ) // Prevents crash if sellerId is null
      .map((product) => ({ ...product.toObject() }));

    res.status(200).json({
      status: "success",
      results: productsWithSellers.length,
      data: { products: productsWithSellers },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch products", error });
  }
});

exports.getUserSells = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const sells = await Product.find({ sellerId: userId });
  res.status(200).json({ status: "success", data: sells });
});

exports.markSoldProduct = async (req, res) => {
  try {
    const { requestId } = req.params;
    const sell = await Product.findById(requestId);
    console.log();
    if (!sell) {
      return res.status(404).json({ message: "product not found" });
    }

    sell.status = "sold";
    await sell.save();

    res.status(200).json({ message: "Product marked sold" });
  } catch (error) {
    res.status(500).json({ message: "Error marking sold the product", error });
  }
};

exports.getAllStudentSells = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query.sellerId) filter.sellerId = req.query.sellerId;

  const validCategories = [
    "stationary",
    "vehicle",
    "fashion",
    "grocery",
    "electronics",
    "food",
  ];
  if (
    req.query.category &&
    !validCategories.includes(req.query.category.toLowerCase())
  ) {
    return next(new AppError("Invalid category provided", 400));
  }
  if (req.query.category) filter.category = req.query.category.toLowerCase();

  const features = new APIFeatures(
    Product.find(filter).populate(
      "sellerId",
      "username contactNumber hostelName roomNumber sellerType profilePicture"
    ),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query.exec();
  const productsWithSellers = products
    .filter((product) => product.sellerType === "student") // Filter only shopkeepers
    .map((product) => {
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
  const validCategories = [
    "stationary",
    "vehicle",
    "fashion",
    "grocery",
    "electronics",
    "food",
  ];

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



exports.deleteSell=catchAsync(async (req,res,next) => {
  console.log("req.params"+req.params.id);
 const doc=await Product.findByIdAndDelete(req.params.id);
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