const express = require("express");
const productController = require("./../controllers/productController");
const requestedRentController = require("./../controllers/requestedRentController");
const authController = require("../controllers/authController");
const { adminMiddleware } = require("./../middlewares/authMiddleware");
import {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
} from "../controllers/contactQueryController.js";
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

module.exports = router;
