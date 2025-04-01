const express = require("express");
const productController = require("./../controllers/productController");
const upload = require("../middlewares/upload");
const router = express.Router();
const authController=require('../controllers/authController')

router
  .route("/")
  .get(productController.getAllProducts)
  
  router.get('/sells', productController.getAllStudentSells);
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)

router
  .route("/category/:categoryName")
  .get(productController.getProductsByCategory);
 // router.use(authController.protect);
  router.post("/createProduct",authController.protect, upload.single("image"), productController.createProduct);
  router.get('/userSells',productController.getUserSells);
  router.put("/markSold/:requestId",productController.markSoldProduct);
module.exports = router;
