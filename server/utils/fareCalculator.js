// utils/demandCalculator.js
const RideBooking = require('../models/RideBooking');
const Captain = require('../models/Captain');

const baseFareRates = {
  cab: 15,          // Base fare per km far a cab
  bike: 10,         // Base fare per km for a bike
  eRickshaw: 8,     // Base fare per km fore-rikshaw
  shuttle: 5        // base fare per km for a shuttle
};

// Func to calculate distance between two locations
const calculateDistance = (pickup, dropPoint) => {
  //will replace this with actual distance calculation logic later  (now random values [5,15])
  return Math.random() * (15 - 5) + 5; // Random distance between 5 to 15 km
};


// Func to get demand factor based on location
const getDemandFactor = async (location) => {
  try {
    // Count active ride requests at the location
    const activeRequests = await RideBooking.countDocuments({
      pickup: location,
      status: 'pending'
    });

    // Count available captains at the location
    const availableCaptains = await Captain.countDocuments({
      location: location,
      isAvailable: true,
      status: 'active'
    });

    // Calculate demand factor based on requests vs. captains
    const demandRatio = availableCaptains > 0 
      ? activeRequests / availableCaptains 
      : activeRequests; // If no captains, use requests count directly

    // Calculate demand factor
    if (demandRatio > 3) {
      return 2.5; // High demand
    } else if (demandRatio > 2) {
      return 1.75; // Medium demand
    } else {
      return 1.25; // Low demand
    }
  } catch (error) {
    console.error('Error calculating demand factor:', error.message);
    return 1.0; // Default to low demand if error occurs
  }
};

const calculateFare = async (pickup, dropPoint, vehicleType) => {
  const distance = calculateDistance(pickup, dropPoint);
  const baseFare = baseFareRates[vehicleType] * distance;

  const demandFactor = await getDemandFactor(pickup);

  let totalFare = baseFare * demandFactor;

  const maxFare = baseFare * 3;
  if (totalFare > maxFare) {
    totalFare = maxFare;
  }

  return Math.round(totalFare);
};

module.exports = { calculateFare };