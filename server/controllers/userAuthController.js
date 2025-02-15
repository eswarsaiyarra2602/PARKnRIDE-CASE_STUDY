const User = require('../models/User');
const Captain = require('../models/Captain');
const jwt = require('jsonwebtoken');

// Sign JWT Token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User or Captain
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, contact, metroCard, role, age, location } = req.body;
    
    // Prevent self-assigning admin role
    if (role === 'admin') return res.status(400).json({ message: 'Unauthorized' });
    if (!name || !email || !password || !contact) return res.status(400).json({ message: 'Please fill in all fields' });
    if (!isNaN(contact) && contact.toString().length !== 10) return res.status(400).json({ message: 'Invalid contact number' });

    const existingUser = await User.findOne({ email });
    const existingContact = await User.findOne({ contact });
    if (existingUser || existingContact) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, contact, metroCard, role });
    await user.save();

    // If the role is captain, also create a Captain entry
    if (role === 'captain') {
      if (!age || !location) {
        return res.status(400).json({ message: 'Age and Location are required for Captains' });
      }

      const newCaptain = new Captain({
        userId: user._id,
        name,
        age,
        contact,
        location,
        isAvailable: true,
        status: 'active'
      });

      await newCaptain.save();
    }

    res.status(201).json({ token: generateToken(user) });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login User or Captain
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If the role is captain, verify the existence in the Captain collection
    if (user.role === 'captain') {
      const captain = await Captain.findOne({ userId: user._id });
      if (!captain) {
        return res.status(404).json({ message: 'Captain not found' });
      }
    }

    res.json({ token: generateToken(user) });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};