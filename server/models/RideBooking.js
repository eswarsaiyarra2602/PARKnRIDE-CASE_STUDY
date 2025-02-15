const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideBookingSchema = new Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },
  pickup: {
    type: String,
    required: true
  },
  dropPoint: {
    type: String,
    required: true
  },
  totalFare: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, can be assigned later
  },
  contact: {
    type: String,
    required: true
  },
  pickupTime: {
    type: Date,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['cab', 'bike', 'e-rickshaw', 'shuttle'],
    required: true
  },
  refundStatus: {
    type: String,
    enum: ['rejected', 'success', 'initiated', 'processing'],
    default: null 
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('RideBooking', RideBookingSchema);