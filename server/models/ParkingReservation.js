const mongoose = require('mongoose');

const parkingReservationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parkingLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending'
  },
  duration: {
    type: String, 
    required: true
  },
  totalPrice: {
    type: Number,  
    required: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  refundStatus: {
    type: String,
    enum: ['not-applicable', 'requested', 'approved', 'rejected'],
    default: 'not-applicable'
  }
});

module.exports = mongoose.model('ParkingReservation', parkingReservationSchema);