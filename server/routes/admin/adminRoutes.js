// routes/admin/parkingSlotRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuthMiddleware');
const {addParkingSlot, updateParkingSlot, deleteParkingSlot} = require('../../controllers/parkingSlotController');

// Route to add a new parking slot
router.post('/parking-slot', adminAuthMiddleware, addParkingSlot);

// Route to update a parking slot by location code
router.put('/parking-slot/:locationCode', adminAuthMiddleware, updateParkingSlot);

// Route to delete a parking slot by location code
router.delete('/parking-slot/:locationCode', adminAuthMiddleware, deleteParkingSlot);

module.exports = router;