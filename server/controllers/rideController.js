const RideBooking = require('../models/RideBooking');
const User = require('../models/User');
const { calculateFare } = require('../utils/fareCalculator');
const rideRefundCalculator = require('../utils/rideRefundCalculator');
const rewardCoins = require('../utils/rewardCoins');
//book a ride
const bookRide = async (req, res) => {
    try {
      const { pickup, dropPoint, vehicleType, pickupTime } = req.body;
      const userId = req.user._id;
      const contact = req.user.contact;
  
      if (!pickup || !dropPoint || !vehicleType || !pickupTime) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Calculate fare using a utility function
      const totalFare = calculateFare(pickup, dropPoint, vehicleType);
  
      // Generate unique booking ID
      const shortUserId = userId.toString().slice(-5);
      const timestamp = Date.now();
      const bookingId = `RIDE-${shortUserId}-${timestamp}`;
  
      const newRide = new RideBooking({
        bookingId,
        status: 'pending',
        pickup,
        dropPoint,
        totalFare,
        userId,
        contact,
        pickupTime,
        vehicleType
      });
  
      await newRide.save();
      
      //reward coins for user
      const rewardCoins = rewardCoins(totalFare);
      await User.findByIdAndUpdate(userId, { $inc: { rewardCoins: rewardCoins } });
      
      // Push the booking ID into the user's rides array
      await User.findByIdAndUpdate(
        userId,
        { $push: { rides: bookingId } },
        { new: true }
      );
  
      return res.status(201).json({ message: 'Ride booked successfully', bookingId, totalFare });
    } catch (error) {
      console.error('Error booking ride:', error.message);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };


  //get rides by user
const getRides = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const rides = await RideBooking.find({ userId }).sort({ createdAt: -1 });
  
      return res.status(200).json({ rides });
    } catch (error) {
      console.error('Error fetching rides:', error.message);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

  const getRideById = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      const ride = await RideBooking.findOne({ _id: id, userId });
      
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
  
      return res.status(200).json({ ride });
    } catch (error) {
      console.error('Error fetching ride:', error.message);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };


  //cancel ride
  const cancelRide = async (req, res) => {
    try {
      const { bookingId } = req.body;
      const userId = req.user._id;
  
      // Find the ride
      const ride = await RideBooking.findOne({ bookingId, userId });
  
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
  
      // Check if the ride is already completed or cancelled
      if (ride.status === 'completed' || ride.status === 'cancelled') {
        return res.status(400).json({ message: 'Cannot cancel this ride' });
      }
  
      
      ride.status = 'cancelled';
      ride.refundStatus = 'initiated';
      ride.refundAmount = rideRefundCalculator(ride.totalFare, ride.pickupTime); 
      await ride.save();
  
      return res.status(200).json({ message: 'Ride cancelled successfully', refundStatus: ride.refundStatus });
    } catch (error) {
      console.error('Error cancelling ride:', error.message);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };


  module.exports = { bookRide, getRides, getRideById, cancelRide };