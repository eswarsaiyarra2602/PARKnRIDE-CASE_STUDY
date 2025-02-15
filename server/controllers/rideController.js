const RideBooking = require('../models/RideBooking');
const User = require('../models/User');
const { calculateFare } = require('../utils/fareCalculator');
const rideRefundCalculator = require('../utils/rideRefundCalculator');
const rewardCoins = require('../utils/rewardCoins');
//book a ride
const getFare = async (req, res) => {
    try { 
      const { pickup, dropPoint, vehicleType } = req.body;
      if (!pickup || !dropPoint || !vehicleType) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      totalFare = await calculateFare(pickup, dropPoint, vehicleType);
      return res.status(200).json({ totalFare });
    } catch (error) {
      console.error('Error getting fare:', error.message);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

const bookRide = async (req, res) => {
    try {
      const { pickup, dropPoint, vehicleType, pickupTime } = req.body;
      const user = req.user;
      const userId = req.user._id;
      const contact = req.user.contact;
  
      if (!pickup || !dropPoint || !vehicleType || !pickupTime) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Calculate fare using a utility function
      const totalFare = await calculateFare(pickup, dropPoint, vehicleType);
  
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
      const coins = rewardCoins(totalFare);
      await User.findByIdAndUpdate(userId, { $inc: { rewardCoins: coins } });
      
      // Push the booking ID into the user's rides array
      await User.findByIdAndUpdate(
        userId,
        { $push: { rides: bookingId } },
        { new: true }
      );
      

      //sendingEmail
      const sendEmail = require('../utils/sendEmail');
      try {
        // Construct the email content
        const decodedPickupTime = new Date(pickupTime).toLocaleString('en-IN', {
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true
        });
        
        // Construct the email content with the formatted pickupTime
        const emailHtml = `
          <h2>Ride Booking Confirmed</h2>
          <p>Hi ${user.name},</p>
          <p>Your ride has been successfully booked!</p>
          <ul>
            <li><strong>Pickup Point:</strong> ${pickup}</li>
            <li><strong>Drop Point:</strong> ${dropPoint}</li>
            <li><strong>Vehicle Type:</strong> ${vehicleType}</li>
            <li><strong>Pickup Time:</strong> ${decodedPickupTime}</li>
            <li><strong>Total Fare:</strong> ₹${totalFare}</li>
          </ul>
          <p>Thank you for choosing our service!</p>
        `;

        // Call sendEmail utility
        await sendEmail(user.email, 'Ride Booking Confirmation', emailHtml);

      } catch (error) {
        console.error('Error sending booking confirmation email:', error);
      }
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


  module.exports = { bookRide, getRides, getRideById, cancelRide, getFare };