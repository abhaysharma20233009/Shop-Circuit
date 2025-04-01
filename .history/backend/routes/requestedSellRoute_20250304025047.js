const express = require('express');
const { 
  
  createSellRequest, getAllSellRequests, updateSellRequestStatus 
} = require('../controllers/requestedSellController.js');
//const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();



// // Sell Requests Routes
// router.post('/sell', protect, restrictTo('student'), createSellRequest);
// router.get('/sell', protect, getAllSellRequests);
// router.patch('/sell/:id', protect, restrictTo('admin'), updateSellRequestStatus);
// Sell Requests Routes
router.post('/createSell',  createSellRequest);
router.get('/', getAllSellRequests);
router.patch('/sell/:id', updateSellRequestStatus);

module.exports = router;