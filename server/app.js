require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const parkingLocationRoutes = require('./routes/admin/parkingLocationRoutes');
const parkingSpaceRoutes = require('./routes/admin/parkingSpaceRoutes');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const parkingSlotRoutes = require('./routes/parkingSlotRoutes');
const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/admin/parking-location', parkingLocationRoutes);
app.use('/admin/parking-space', parkingSpaceRoutes);
app.use('/api/parking-slots', parkingSlotRoutes);
app.use('/api/rides', rideRoutes)

// Connect DB and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));