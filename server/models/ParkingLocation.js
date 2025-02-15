const mongoose = require('mongoose');

// Define the parking slot schema
const parkingLocationSchema = new mongoose.Schema({
  locationCode:{
    type: String,
    required: true, 
    unique: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
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
parkingLocationSchema.index({ parkingLocation: '2dsphere' });

module.exports = mongoose.model('ParkingLocation', parkingLocationSchema);