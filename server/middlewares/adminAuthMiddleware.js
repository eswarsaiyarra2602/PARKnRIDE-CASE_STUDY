const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded._id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has admin privileges
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }

    // Attach user to the request object and proceed to the next middleware
    req.user = user; 
    next(); 

  } catch (error) {
    console.log("Error in adminAuthMiddleware:", error.message); // Log any error messages
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = adminAuthMiddleware;