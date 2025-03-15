const mongoose = require('mongoose');

const requestedRentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  numberOfItems: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled',],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const RequestedRent = mongoose.model('RequestedRent', requestedRentSchema);

module.exports = { RequestedRent };
