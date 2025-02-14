const ParkingSlot = require('../models/ParkingSlot');

// Add new parking slot
const addParkingSlot = async (req, res) => {
  try {
    const { locationName, locationCode, address, slotCount, price, parkingLocation } = req.body;
    
    // Validate required fields
    if (!locationName || !locationCode || !address || !slotCount || !price || !parkingLocation) {
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

    // Check if a slot with the same locationCode already exists
    const existingSlot = await ParkingSlot.findOne({ locationCode });
    if (existingSlot) {
      return res.status(400).json({ message: 'Parking slot with this location code already exists' });
    }

    // Create new parking slot
    const newParkingSlot = new ParkingSlot({
      locationName,
      locationCode,
      address,
      slotCount,
      price,
      parkingLocation
    });

    await newParkingSlot.save();
    res.status(201).json(newParkingSlot);
  } catch (error) {
    console.error('Error in addParkingSlot:', error.message);
    res.status(500).json({ message: 'Error adding parking slot', error: error.message });
  }
};

// Update parking slot details
const updateParkingSlot = async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { locationName, address, slotCount, price, parkingLocation } = req.body;

    const parkingSlot = await ParkingSlot.findOne({ locationCode });
    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // Update the slot details
    parkingSlot.locationName = locationName || parkingSlot.locationName;
    parkingSlot.address = address || parkingSlot.address;
    parkingSlot.slotCount = slotCount || parkingSlot.slotCount;
    parkingSlot.price = price || parkingSlot.price;
    if (parkingLocation) {
      parkingSlot.parkingLocation = parkingLocation;
    }

    await parkingSlot.save();
    res.status(200).json(parkingSlot);
  } catch (error) {
    console.error('Error in updateParkingSlot:', error.message);
    res.status(500).json({ message: 'Error updating parking slot', error: error.message });
  }
};

// Delete parking slot
const deleteParkingSlot = async (req, res) => {
  try {
    const { locationCode } = req.params;

    const parkingSlot = await ParkingSlot.findOneAndDelete({ locationCode });
    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    res.status(200).json({ message: 'Parking slot deleted successfully' });
  } catch (error) {
    console.error('Error in deleteParkingSlot:', error.message);
    res.status(500).json({ message: 'Error deleting parking slot', error: error.message });
  }
};


// Get nearest parking slots (metro stations) based on user location
const getNearestParkingSlots = async (req, res) => {
  try {
    const { latitude, longitude, maxDistanceFromUser } = req.body; // User's location coordinates

    const distance = maxDistanceFromUser || 10000;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    //find nearest sorted by distance
    const nearbySlots = await ParkingSlot.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: distance,
          spherical: true
        }
      }
    ]);

    if (nearbySlots.length === 0) {
      return res.status(404).json({ message: 'No nearby parking slots found' });
    }

    res.status(200).json(nearbySlots);
  } catch (error) {
    res.status(500).json({ message: 'Error finding nearest parking slots', error: error.message });
  }
};


module.exports = {
  addParkingSlot,
  updateParkingSlot,
  deleteParkingSlot,
  getNearestParkingSlots
};