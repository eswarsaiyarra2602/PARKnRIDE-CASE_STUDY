const express = require('express');
const { getNearestParkingLocations } = require('../controllers/parkingLocationController');
const { bookParkingSpace, cancelParkingBookingSpace } = require('../controllers/parkingReservationController');
const {protect} = require('../middlewares/userAuthMiddleware');
const router = express.Router();

router.post('/nearest', getNearestParkingLocations);
router.post('/book-slot', protect, bookParkingSpace);
router.post('/cancel-slot', protect, cancelParkingBookingSpace);

module.exports = router;