const ParkingReservation = require('../models/ParkingReservation');
const ParkingSlot = require('../models/ParkingSlot');
const User = require('../models/User');

// Book Parking Slot
const bookParkingSlot = async (req, res) => {
  try {
    const { parkingLocationCode, duration, parkingDurationType } = req.body;
    const userId = req.user._id;  // Obtained from protect middleware

    // Find the parking slot based on the location code
    if(!parkingLocationCode || !duration || duration<=0  || !parkingDurationType) {
        return res.status(400).json({ message: 'Missing Fields or invalid duration' });
    }
    const parkingSlot = await ParkingSlot.findOne({ locationCode: parkingLocationCode });
    if (!parkingSlot) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Check for available slots
    if (parkingSlot.slotCount <= 0) {
      return res.status(400).json({ message: 'No available slots at this location' });
    }

    // Generate custom bookingId
    const shortUserId = userId.toString().slice(-5);  // Get last 5 characters of user ID
    const timestamp = Date.now();
    const bookingId = `PKG-${shortUserId}-${timestamp}`;

    // Reduce available slot count by 1
    parkingSlot.slotCount -= 1;
    await parkingSlot.save();

    // Create a new parking reservation
    let totalPrice = 0;
    if(parkingDurationType === 'hour') {
        totalPrice = parkingSlot.price.perHour * duration;
    }
    else if(parkingDurationType === 'day') {
        totalPrice = parkingSlot.price.perDay * duration;
    }
    else if(parkingDurationType == 'month') {
        totalPrice = parkingSlot.price.perMonth * duration;
    }
    else{
        return res.status(400).json({ message: 'Invalid duration type' });
    }

    if (isNaN(totalPrice) || totalPrice < 0) {
      return res.status(400).json({ message: 'Invalid price calculation' });
    }

    const newReservation = new ParkingReservation({
      bookingId,
      userId,
      parkingLocation: parkingSlot._id, 
      bookingStatus: 'confirmed',
      duration: `${duration} ${parkingDurationType}`, 
      totalPrice,
      bookingTime: Date.now(),
      refundStatus: 'not-applicable'
    });

    // Save the reservation to the database
    await newReservation.save();

    // Add the booking to the user's parking reservations array
    await User.findByIdAndUpdate(userId, { $push: { parkingReservation: newReservation._id } });

    res.status(201).json({ message: 'Booking confirmed', bookingId: newReservation.bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking parking slot', error: error.message });
  }
};

module.exports = {
  bookParkingSlot,
};