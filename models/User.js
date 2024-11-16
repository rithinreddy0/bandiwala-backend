const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number }, // Store OTP temporarily
    otpExpires: { type: Date }, // OTP expiration
    deliveryAddress: {type:String} ,// Include the address schema
    mobileNo:{type:Number}
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
