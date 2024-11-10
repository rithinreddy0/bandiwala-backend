const jwt = require('jsonwebtoken');
require('dotenv').config();
const Vendor = require('../models/Vendor'); // Import the Vendor model if needed for additional checks

exports.isVendor = async (req, res, next) => {
  try {
    // Get the token from the header
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    if (!token) {
      return res.status(410).json({ message: 'Authentication token is missing.' });
    }

    // Verify the token
    
    const decoded = await jwt.verify(token, "bandiwala");
    console.log(decoded._id)
    // Check if the token corresponds to a valid vendor
    const vendor = await Vendor.findById({_id:decoded._id});
    console.log(vendor)
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


