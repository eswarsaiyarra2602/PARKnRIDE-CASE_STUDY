const mongoose = require('mongoose');
const ParkingSpace = require('../models/ParkingSpace');
const ParkingLocation = require('../models/ParkingLocation');

// Add Parking Space to db by admin
const addParkingSpace = async (req, res) => {
  try {
    const { locationCode, slotNumber } = req.body;

    // Check if locationCode and slotNumber are provided
    if (!locationCode || !slotNumber) {
      return res.status(400).json({ message: 'locationCode and slotNumber are required' });
    }

    // Check if the parking location exists
    const parkingLocation = await ParkingLocation.findOne({ locationCode });
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Check if slotNumber is already in use for the location
    const existingSlot = await ParkingSpace.findOne({ 
      parkingLocation: parkingLocation._id, 
      slotNumber 
    });
    if (existingSlot) {
      return res.status(400).json({ message: 'Slot number already exists for this location' });
    }

    // Create and save the new parking space
    const newParkingSpace = new ParkingSpace({
      parkingLocation: parkingLocation._id,
      locationCode: locationCode,
      slotNumber
    });

    await newParkingSpace.save();

    res.status(201).json({ 
      message: 'Parking space added successfully', 
      parkingSpace: newParkingSpace 
    });
  } catch (error) {
    console.error("Error adding parking space: ", error.message);
    res.status(500).json({ message: 'Error adding parking space', error: error.message });
  }
};

// Update Parking Space
const updateParkingSpace = async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { slotNumber } = req.body;

    // Check if the parking location exists
    const parkingLocation = await ParkingLocation.findOne({ locationCode });
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Check if the parking space exists
    const parkingSpace = await ParkingSpace.findOne({
      parkingLocation: parkingLocation._id,
      slotNumber
    });
    if (!parkingSpace) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    // Update the slotNumber if provided
    if (slotNumber) {
      // Check if the new slotNumber already exists for the location
      const existingSlot = await ParkingSpace.findOne({ 
        parkingLocation: parkingLocation._id, 
        slotNumber 
      });
      if (existingSlot && existingSlot._id.toString() !== spaceId) {
        return res.status(400).json({ message: 'Slot number already in use for this location' });
      }

      parkingSpace.slotNumber = slotNumber;
    }

    await parkingSpace.save();

    res.status(200).json({ 
      message: 'Parking space updated successfully', 
      parkingSpace 
    });
  } catch (error) {
    console.error("Error updating parking space:", error.message);
    res.status(500).json({ message: 'Error updating parking space', error: error.message });
  }
};

// Delete Parking Space
const deleteParkingSpace = async (req, res) => {
  try {
    const { locationCode, slotNumber } = req.params;

    // Check if the parking location exists
    const parkingLocation = await ParkingLocation.findOne({ locationCode });
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Check if the parking space exists
    const parkingSpace = await ParkingSpace.findOne({
      parkingLocation: parkingLocation._id,
      slotNumber
    });
    if (!parkingSpace) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    // Delete the parking space
    await ParkingSpace.deleteOne({ _id: parkingSpace._id });

    res.status(200).json({ message: 'Parking space deleted successfully' });
  } catch (error) {
    console.error("Error deleting parking space:", error.message);
    res.status(500).json({ message: 'Error deleting parking space', error: error.message });
  }
};

const getParkingSpaces = async (req, res) => {
  try {
    const { locationCode } = req.params;

    // Check if locationCode is provided
    if (!locationCode) {
      return res.status(400).json({ message: 'Location code is required' });
    }

    // Check if the parking location exists
    const parkingLocation = await ParkingLocation.findOne({ locationCode });
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Fetch all parking spaces for the location
    const parkingSpaces = await ParkingSpace.find({ 
      parkingLocation: parkingLocation._id 
    }).populate({
      path: 'bookedSlots.user',
      select: 'name email' // Populate user details if needed
    });

    res.status(200).json(parkingSpaces);
  } catch (error) {
    console.error("Error fetching parking spaces:", error.message);
    res.status(500).json({ message: 'Error fetching parking spaces', error: error.message });
  }
};

module.exports = {
  getParkingSpaces,
  addParkingSpace,
  updateParkingSpace,
  deleteParkingSpace
};