const express = require('express');
const authController=require('../controllers/authController.js')
const { 
  createRentRequest, getUserRentRequests, markFulfilledRentRequest,getAllPendingRequests
  
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
router.get('/',  getUserRentRequests);
router.get('/rent',  getAllPendingRequests);
router.put('/rent', markFulfilledRentRequest);


module.exports = router;
