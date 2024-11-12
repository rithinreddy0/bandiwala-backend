const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const vendorSchema = new mongoose.Schema({
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { 
    type: Number 
  }, // Store OTP temporarily
  otpExpires: { 
    type: Date 
  }, // OTP expiration
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // You can store the URL or path to the image
  },
  cuisineType: {
    type: String, 
    
  },
  operatingHours: {
    open: { type: String},  
    close: { type: String},
  },
  menuItems: [{
    type: mongoose.Types.ObjectId,
    ref: 'MenuItem',
  }],
  orders: [{
    type: mongoose.Types.ObjectId,
    ref: 'Order',
  }],
  ratings: [{
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
  }],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vendor', vendorSchema);
