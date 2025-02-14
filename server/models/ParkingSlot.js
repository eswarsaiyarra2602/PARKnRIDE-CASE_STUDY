const mongoose = require('mongoose');

// Define the parking slot schema
const parkingSlotSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
  },
  locationCode: {
    type: String,
    required: true,
    unique: true, // Ensures location code is unique
  },
  address: {
    type: String,
    required: true,
  },
  slotCount: {
    type: Number,
    required: true,
    min: 0, // cant be negative
  },
  price: {
    perHour: {
      type: Number,
      required: true,
    },
    perDay: {
      type: Number,
      required: true,
    },
    perMonth: {
      type: Number,
      required: true,
    },
  },
  currentUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model (can be the user who reserved a slot)
    }
  ],
  // Add the geo-spatial location data (coordinates)
  parkingLocation: {
    type: { type: String, enum: ['Point'], required: true },  // Set type as Point for geo-spatial data
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true,
    }
  }
}, { timestamps: true });

// Add 2dsphere index to allow for geo-spatial queries
parkingSlotSchema.index({ parkingLocation: '2dsphere' });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);