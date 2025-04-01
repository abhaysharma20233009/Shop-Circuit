const mongoose = require('mongoose');


const requestedSellSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nuberOfItems: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold',],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});


const RequestedSell = mongoose.model('RequestedSell', requestedSellSchema);

module.exports = { RequestedSell };
