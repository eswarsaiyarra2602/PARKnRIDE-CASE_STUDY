const express = require('express');
const { getNearestParkingSlots } = require('../controllers/parkingSlotController');

const router = express.Router();

router.post('/nearest', getNearestParkingSlots);

module.exports = router;