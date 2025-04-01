const express = require("express");
const productController = require("./../controllers/productController");
const requestedRentController = require("./../controllers/requestedRentController");
const authController = require("../controllers/authController");
const { adminMiddleware } = require("./../middlewares/authMiddleware");
const {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
} =require("../controllers/contactQueryController.js");
const router = express.Router();

router.use(authController.protect);

// GET all products (Admin Only)
router.get(
  "/products",
  adminMiddleware,
  productController.getAllProductsForAdmin
);

router.delete(
  "/product/:id",
  adminMiddleware,
  productController.deleteProductAsAdmin
);

// routes for rents

router.get(
  "/rents",
  adminMiddleware,
  requestedRentController.getAllPendingRequestsForAdmin
);

router.delete(
  "/rent/:id",
  adminMiddleware,
  requestedRentController.deletePendingRequestAsAdmin
);


// User can submit a contact query
router.post("/contact", createQuery);

// Admin can fetch all queries
router.get("/contact-queries", getAllQueries);
module.exports = router;
