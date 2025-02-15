const express = require('express');
const router = express.Router();

const {protect} = require('../middlewares/userAuthMiddleware');
const { bookRide, getRides, getRideById, cancelRide} = require('../controllers/rideController');

router.post('/book-ride', protect, bookRide);
router.get('/recent-rides', protect, getRides);
router.get('/ride/:id', protect, getRideById);
router.post('/cancel-ride', protect, cancelRide);

module.exports = router;