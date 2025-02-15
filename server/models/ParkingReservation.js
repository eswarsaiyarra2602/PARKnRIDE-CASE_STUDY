const mongoose = require('mongoose');
const ParkingLocation = require('./ParkingLocation');

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
  parkingLocationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLocation',
    required: true
  },
  parkingSpaceId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  refundStatus: {
    type: String,
    enum: ['not-applicable', 'requested', 'initiated', 'rejected'],
    default: 'not-applicable',
  },
  refundAmount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('ParkingReservation', parkingReservationSchema);