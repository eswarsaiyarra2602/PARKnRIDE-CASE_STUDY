const ParkingLocation = require('../models/ParkingLocation');

// Add new parking location
const addParkingLocation = async (req, res) => {
  try {
    const { locationName, locationCode, address, price, parkingLocation } = req.body;
    
    // Validate required fields
    if (!locationName || !locationCode || !address || !price || !parkingLocation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if parkingLocation has the required GeoJSON structure
    if (
      !parkingLocation.type ||
      parkingLocation.type !== 'Point' ||
      !Array.isArray(parkingLocation.coordinates) ||
      parkingLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({ message: 'Invalid parking location format' });
    }

    // Check if a Location with the same locationCode already exists
    const existingLocatoin = await ParkingLocation.findOne({ locationCode });
    if (existingLocatoin) {
      return res.status(400).json({ message: 'Parking Location with this location code already exists' });
    }

    // Create new parking Location
    const newParkingLocation = new ParkingLocation({
      locationName,
      locationCode,
      address,
      price,
      parkingLocation
    });

    await newParkingLocation.save();
    res.status(201).json(newParkingLocation);
  } catch (error) {
    console.error('Error in adding ParkingLocation:', error.message);
    res.status(500).json({ message: 'Error adding parking location', error: error.message });
  }
};

// Update parking slot details
const updateParkingLocation = async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { locationName, address, price, parkingLocation } = req.body;

    const parkingLocationDocument = await ParkingLocation.findOne({ locationCode });
    if (!parkingLocationDocument) {
      return res.status(404).json({ message: 'Parking Location not found' });
    }

    // Update the location details
    parkingLocationDocument.locationName = locationName || parkingLocationDocument.locationName;
    parkingLocationDocument.address = address || parkingLocationDocument.address;
    parkingLocationDocument.price = price || parkingLocationDocument.price;
    if (parkingLocation) {
      parkingLocationDocument.parkingLocation = parkingLocation;
    }

    await parkingLocationDocument.save();
    res.status(200).json(parkingLocationDocument);
  } catch (error) {
    console.error('Error in updateParkingSlot:', error.message);
    res.status(500).json({ message: 'Error updating parking slot', error: error.message });
  }
};

// Delete parking slot
const deleteParkingLocation = async (req, res) => {
  try {
    const { locationCode } = req.params;

    const parkingLocation = await ParkingLocation.findOneAndDelete({ locationCode });
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    res.status(200).json({ message: 'Parking slot deleted successfully' });
  } catch (error) {
    console.error('Error in deleteParkingSlot:', error.message);
    res.status(500).json({ message: 'Error deleting parking slot', error: error.message });
  }
};


// Get nearest parking slots (metro stations) based on user location
const getNearestParkingLocations = async (req, res) => {
  try {
    const { latitude, longitude, maxDistanceFromUser } = req.body; // User's location coordinates

    const distance =  maxDistanceFromUser || 10000;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    //find nearest sorted by distance
    const nearbyLocations = await ParkingLocation.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: distance,
          spherical: true
        }
      }
    ]);

    if (nearbyLocations.length === 0) {
      return res.status(404).json({ message: 'No nearby parking slots found' });
    }

    res.status(200).json(nearbyLocations);
  } catch (error) {
    res.status(500).json({ message: 'Error finding nearest parking slots', error: error.message });
  }
};


module.exports = {
  addParkingLocation,
  updateParkingLocation,
  deleteParkingLocation,
  getNearestParkingLocations
};