const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
exports.createProduct = async (req, res) => {
  try {
    const { productName, price, noOfItems, description, category } =
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
    const user=await User.findById(sellerId);
    const sellerType=user.role;
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

exports.deleteSell = catchAsync(async (req, res, next) => {
  console.log("req.params" + req.params.id);
  const doc = await Product.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No Rent Request found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: doc,
    },
  });
});
exports.getAllProductsForAdmin = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate(
        "sellerId",
        "shopName shopAddress contactNumber sellerType roomNumber hostelName"
      )
      .exec();

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

exports.deleteProductAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log(deletedProduct);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create notification
    const recipientId = deletedProduct.sellerId;
    const senderId = req.user._id;
    const content = `Your product ${deletedProduct.productName} is deleted by admin`;

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

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
