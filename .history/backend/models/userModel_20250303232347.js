const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    trim: true,
    required: [true, "Product should have a name"],
    maxlength: [20, "A product name must have 20 or fewer characters"],
    minlength: [1, "A product name must have at least 1 character"],
    unique: true,
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
  slug: {
    type: String,
    unique: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Pre-save hook to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("productName") || this.isNew) {
    this.slug = slugify(this.productName, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
