const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuthMiddleware');
const { 
  addParkingSpace, 
  updateParkingSpace, 
  deleteParkingSpace, 
} = require('../../controllers/parkingSpaceController');
// Admin routes to add, update, and delete parking spaces for a particular location
router.post('/', adminAuthMiddleware, addParkingSpace);
router.put('/:locationCode', adminAuthMiddleware, updateParkingSpace);
router.delete('/:locationCode', adminAuthMiddleware, deleteParkingSpace);

module.exports = router;