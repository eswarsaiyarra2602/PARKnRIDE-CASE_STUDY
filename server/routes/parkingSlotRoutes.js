const express = require('express');
const { getNearestParkingSlots } = require('../controllers/parkingSlotController');
const { bookParkingSlot } = require('../controllers/parkingReservationController');
const {protect} = require('../middlewares/userAuthMiddleware');
const router = express.Router();

router.post('/nearest', getNearestParkingSlots);
router.post('/book-slot', protect, bookParkingSlot);
module.exports = router;