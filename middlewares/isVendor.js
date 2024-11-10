const jwt = require('jsonwebtoken');
require('dotenv').config();
const Vendor = require('../models/Vendor'); // Import the Vendor model if needed for additional checks

exports.isVendor = async (req, res, next) => {
  try {
    // Get the token from the header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(410).json({ message: 'Authentication token is missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token corresponds to a valid vendor
    const vendor = await Vendor.findById(decoded._id);

    if (!vendor) {
      return res.status(410).json({ message: 'Invalid token or vendor not found.' });
    }

    // Attach vendor information to the request object
    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(410).json({ message: 'Unauthorized access. Token verification failed.', error: error.message });
  }
};


