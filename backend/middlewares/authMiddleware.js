const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }

  next();
};

module.exports = { adminMiddleware };
