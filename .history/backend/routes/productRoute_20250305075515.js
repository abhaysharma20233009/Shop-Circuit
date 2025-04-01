const express = require("express");
const productController = require("./../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  router.post('/createProduct',productController.createProduct);
  router.get('/sells', getAllStudentSells);
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router
  .route("/category/:categoryName")
  .get(productController.getProductsByCategory);

module.exports = router;
