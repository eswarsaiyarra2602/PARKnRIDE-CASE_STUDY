const mongoose = require('mongoose');

// Define the parking slot schema
const ParkingSpaceSchema = new mongoose.Schema({
  parkingLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLocation', // Reference to the ParkingLocation model
    required: true,
  },
  locationCode:{
    type: String,
    required: true,  
  },
  slotNumber: {
    type: String,
    required: true,  // e.g. Slot-001, Slot-002, etc.
  },
  bookedSlots: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (who reserved the slot)
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      }
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('ParkingSpace', ParkingSpaceSchema);