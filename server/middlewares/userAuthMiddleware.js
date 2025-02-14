const jwt = require('jsonwebtoken');
const User = require('../models/User');



const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
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
  
      // Attach user to the request object and proceed to the next middleware
      req.user = user; 
      next(); 
  
    } catch (error) {
      console.log("Error in adminAuthMiddleware:", error.message); // Log any error messages
      res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

module.exports = { protect };