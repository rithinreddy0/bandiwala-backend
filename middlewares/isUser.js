const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User'); // Import the User model if needed for additional checks

exports.isUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(410).json({ message: 'Authentication token is missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID if additional validation is needed
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(410).json({ message: 'Invalid token or user not found.' });
    }

    // Attach user information to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(410).json({ message: 'Unauthorized access. Token verification failed.', error: error.message });
  }
};


