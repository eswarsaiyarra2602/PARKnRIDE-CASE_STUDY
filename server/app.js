require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const parkingSlotRoutes = require('./routes/parkingSlotRoutes');
const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/parking-slots', parkingSlotRoutes);

// Connect DB and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));