const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign JWT Token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, metroCard } = req.body;
    if(req.body && req.body.role == 'admin') return res.status(400).json({ message: 'Unauthorized' }); // Prevent user trying to assign admin role himself
    if(!name || !email || !password) return res.status(400).json({ message: 'Please fill in all fields' });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, metroCard});
    await user.save();

    res.status(201).json({ token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};