const express = require("express");
const productController = require("./../controllers/productController");
const upload = require("../middlewares/upload");
const router = express.Router();
const authController=require('../controllers/authController')
router.use(authController.protect);
router
  .route("/")
  .get(productController.getAllProducts)
  router.post("/createProduct", upload.single("image"), productController.createProduct);
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
