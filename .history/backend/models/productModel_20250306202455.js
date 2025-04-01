const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    trim: true,
    required: [true, "Product should have a name"],
    maxlength: [20, "A product name must have less or equal to 20 characters"],
    minlength: [1, "A product name must have more or equal to 1 character"],
  },
  price: {
    type: Number,
    required: [true, "Product should have a price"],
  },
  noOfItems: {
    type: Number,
    default: 1,
  },
  negotiable: {
    type: Boolean,
    default: false,
  },
  productImage: {
    type: String,
    required: [true, "A product must have an image"],
    default: "default.jpg",
  },
  imageCover: {
    type: String,
    required: [true, "A product must have a cover image"],
    default: "default.jpg",
  },
  description: {
    type: String,
    trim: true,
  },
  sellerType: {
    type: String,
    enum: ["student", "shopkeeper"],
    required: [true, "A product must have a seller type"],
  },
  category: {
    type: String,
    enum: ["stationary", "vehicle", "fashion", "grocery", "electronics", "food"],
    required: [true, "A product must have a category"],
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled'],
    default: 'pending',
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
