const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
    roomNo: { type: String, required: true },
    block: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    landmark: { type: String, required: true }
}, { _id: false }); // Set _id to false to avoid creating an additional _id field for the address

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number }, // Store OTP temporarily
    otpExpires: { type: Date }, // OTP expiration
    address: AddressSchema // Include the address schema
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
