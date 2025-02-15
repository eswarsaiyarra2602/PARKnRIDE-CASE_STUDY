const ParkingReservation = require('../models/ParkingReservation');
const ParkingSpace = require('../models/ParkingSpace');
const ParkingLocation = require('../models/ParkingLocation');
const User = require('../models/User');

// Book Parking Slot

const bookParkingSpace = async (req, res) => {
  try {
    const { locationCode, startTime, endTime, parkingDurationType, duration} = req.body;
    const userId = req.user._id;
    
    if(!locationCode || !startTime || !endTime || !parkingDurationType || !duration) {
      return res.status(400).json({ message: 'Some Fields are Missing!!' });
    }

    const parkingLocation = await ParkingLocation.findOne({ locationCode });
    
    if (!parkingLocation) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    //Find all slots for the given parking location
    const slots = await ParkingSpace.find({ parkingLocation: parkingLocation._id });

    //availability check 
    const availableSlot = slots.find(slot => {
      // Check for each existing booking in this slot
      return slot.bookedSlots.every(booking => {
        // Check if the new time interval does NOT overlap with any existing booking
        return (
          new Date(endTime) <= new Date(booking.startTime) || // New endTime is before existing startTime
          new Date(startTime) >= new Date(booking.endTime)    // New startTime is after existing endTime
        );
      });
    });

    // Step 3: If an available slot is found, book it
    if (availableSlot) {
      // Generate a unique booking ID
      const shortUserId = userId.toString().slice(-5);  // Get last 5 characters of user ID
      const timestamp = Date.now();
      const bookingId = `PKG-${shortUserId}-${timestamp}`;
      
      let totalPrice = 0;
      if(parkingDurationType === 'hour') {
          totalPrice = parkingLocation.price.perHour * duration;
      }
      else if(parkingDurationType === 'day') {
          totalPrice = parkingLocation.price.perDay * duration;
      }
      else if(parkingDurationType == 'month') {
          totalPrice = parkingLocation.price.perMonth * duration;
      }
      else{
          return res.status(400).json({ message: 'Invalid duration type' });
      }

      const newReservation = new ParkingReservation({
        bookingId,
        userId,
        parkingLocationId: parkingLocation._id, 
        parkingSpaceId : availableSlot._id,
        bookingStatus: 'confirmed',
        duration: `${duration} ${parkingDurationType}`, 
        totalPrice,
        startTime,
        endTime,
        bookingTime: Date.now(),
        refundStatus: 'not-applicable'
      });

     

      availableSlot.bookedSlots.push({
        user: userId,
        startTime,
        endTime,
      });

      await newReservation.save();
      await availableSlot.save();
      await User.findByIdAndUpdate(userId, { $push: { parkingReservation: bookingId } });
      
      return res.status(200).json({ message: 'Slot booked successfully', slot: availableSlot, bookingId : bookingId  });
    } else {
      // Step 4: If no slot is available
      return res.status(404).json({ message: 'No available slots for the selected time interval' });
    }
  } catch (error) {
    console.error('Error booking slot:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};


//cancellation - parking slot 
const cancelParkingBookingSpace = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id; // Obtained from protect middleware
 
    // Find the reservation by bookingId and userId
    const reservation = await ParkingReservation.findOne({ bookingId, userId });
    if (!reservation) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking is already canceled
    if (reservation.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check the time difference between current time and booking time
    const currentTime = new Date();
    const staringTime = reservation.startTime;
    const timeDifference = (staringTime - currentTime) / (1000 * 60 * 60); // Convert to hours

    let refundType = 'no-refund';
    let refundAmount = 0;
    // Determine refund eligibility & calculate the refund accordingly
    if (timeDifference > 2) {
      refundType = 'full-refund';
      refundAmount = reservation.totalPrice;
    } else if (timeDifference > 0 && timeDifference <= 2) {
      refundType = 'partial-refund';
      refundAmount = reservation.totalPrice * 0.5;
    } else {
      refundType = 'no-refund';
      refundAmount = 0;
    }

    // Update the reservation status
    reservation.bookingStatus = 'cancelled';
    reservation.refundStatus = refundType === 'no-refund' ? 'not-applicable' : 'initiated';
    reservation.refundAmount = refundAmount;
    await reservation.save();

    // Find the parking space and remove the specific time slot
    const updateResult = await ParkingSpace.updateOne(
      { 
        _id: reservation.parkingSpaceId,
        "bookedSlots.startTime": reservation.startTime,
        "bookedSlots.endTime": reservation.endTime
      },
      {
        $pull: {
          bookedSlots: {
            startTime: reservation.startTime,
            endTime: reservation.endTime,
          }
        }
      }
    );

    // Check if the $pull operation was successful
    if (updateResult.modifiedCount === 0) {
      console.error("Error: Failed to remove the time slot from bookedSlots.");
      return res.status(500).json({ 
        message: 'Failed to update bookedSlots. Please try again later.' 
      });
    }

    
    res.status(200).json({ 
      message: 'Booking canceled', 
      bookingId: reservation.bookingId,
      refundType,
      refundStatus: reservation.refundStatus
    });
  } catch (error) {
    console.error("Error canceling booking:", error.message);
    res.status(500).json({ message: 'Error canceling booking', error: error.message });
  }
};

module.exports = {
  bookParkingSpace, cancelParkingBookingSpace
};