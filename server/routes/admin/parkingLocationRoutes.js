// routes/admin/parkingLoctaionRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuthMiddleware');
const {addParkingLocation, updateParkingLocation, deleteParkingLocation} = require('../../controllers/parkingLocationController');

// admin routes to add, update and delete parking locations
router.post('/', adminAuthMiddleware, addParkingLocation);
router.put('/:locationCode', adminAuthMiddleware, updateParkingLocation);
router.delete('/:locationCode', adminAuthMiddleware, deleteParkingLocation);


module.exports = router;