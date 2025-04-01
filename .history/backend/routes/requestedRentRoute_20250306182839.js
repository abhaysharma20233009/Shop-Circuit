const express = require('express');
const authController=require('../controllers/authController.js')
const { 
  createRentRequest, getAllRentRequests, updateRentRequestStatus,
  
} = require('../controllers/requestedRentController.js');
//const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// // Rent Requests Routes
// router.post('/rent', protect, restrictTo('student'), createRentRequest);
// router.get('/rent', protect, getAllRentRequests);
// router.patch('/rent/:id', protect, restrictTo('admin'), updateRentRequestStatus);

// Rent Requests Routes
router.use(authController.protect);
router.post('/rent',  createRentRequest);
router.get('/',  getAllRentRequests);
router.get('/rent',  getAllRentRequests);
router.patch('/rent/:id', updateRentRequestStatus);


module.exports = router;
