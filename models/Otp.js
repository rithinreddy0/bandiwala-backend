const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // Document will automatically delete after 300 seconds (5 minutes)
  },
})
module.exports = mongoose.model('OTP',otpSchema)