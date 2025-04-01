const express = require("express");
const productController = require("./../controllers/productController");
const upload = require("../middleware/upload");
const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  router.post("/createProduct", upload.single("image"), createProduct);
  router.get('/sells', productController.getAllStudentSells);
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router
  .route("/category/:categoryName")
  .get(productController.getProductsByCategory);

module.exports = router;
