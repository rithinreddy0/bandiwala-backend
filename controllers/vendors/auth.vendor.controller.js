const nodemailer = require('nodemailer');
const Vendor = require("../../models/Vendor");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cloudinary = require('../../config/cloudinaryConfig');
require('dotenv').config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Transporter for sending OTP emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = (otp, email) => {
    const mailOptions = {
        from: 'bandiwala@gmail.com',
        to: email,
        subject: 'Verify your email',
        text: `Your OTP for verification is ${otp}`
    };

    transporter.sendMail(mailOptions);
}

// Helper function to generate OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Example: 1234
}

// Signup
exports.vendorSignup = async (req, res) => {
    const { email, password, phone, address, restaurantName } = req.body;

    try {
        // Check if user already exists
        let user = await Vendor.findOne({ email });
        
        if (user) { 
            if (!user.isVerified) {
                const otp = generateOTP();
                const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

                // Update OTP and expiration for the unverified user
                await Vendor.findOneAndUpdate({ email }, { otp, otpExpires });
                sendMail(otp, user.email);

                return res.status(200).json({ message: "User not verified. New OTP sent to email." });
            }
            // If user exists and is verified
            return res.status(400).json({ message: 'Email already exists, please sign in.' });
        }

        // Create OTP and expiration time for a new user
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user entry
        user = new Vendor({
            otp,
            otpExpires,
            email,
            password: hashedPassword,
            phone,
            address,
            restaurantName
        });

        await user.save();

        // Send OTP to email
        sendMail(otp, user.email);

        return res.status(200).json({ message: 'OTP sent to email for verification' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP
exports.verifyVendorOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the vendor by email
        const user = await Vendor.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Vendor not found' });

        // Check if OTP matches and has not expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Update user verification status and clear OTP fields
        await Vendor.updateOne(
            { email },
            {
                isVerified: true,
                $unset: { otp: "", otpExpires: "" },
            }
        );

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error in OTP verification:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.vendorLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Invalid Details"
            })
        }
        const existing_user = await Vendor.findOne({email})
        // Check if the user is verified
        if (!existing_user.isVerified) return res.status(400).json({ message: 'User is not verified' });

        // Compare hashed password
        const isPasswordCorrect = await bcrypt.compare(password, existing_user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        if (!bcrypt.compare(existing_user.password,password)){
            return res.status(400).json({
                message:"Incorrect Password"
            })
        }
        const payload = {
            _id:existing_user._id,
            email:existing_user.email,
            restaurantName:existing_user.restaurantName,
            logo:existing_user.logo,
            menuItems:existing_user.menuItems,
        }
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey,{
            expiresIn: '1h'
        });
        res.status(200).json({
            message: "Login successful",
            user: existing_user,
            token
        });
    
    }catch (e) {
        console.error(e.message);
        res.status(500).json({ message: 'Server error' });
    }
};


//update profile


exports.updateVendorProfile = async (req, res) => {
    try {
        const {id, restaurantName, address, cuisineType, operatingHours, logo, phone } = req.body;

        if (req.file){
            const result=await cloudinary.uploader.upload(req.file.path,{
                folder:"vendor_logos",
    
            })
            logo=result.secure_url;
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            {
                restaurantName,
                address,
                cuisineType,
                operatingHours,
                logo,
                phone
            },
            { new: true } // Return the updated document
        );

        if (!updatedVendor) {
            return res.status(400).json({ message: 'Vendor not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            vendor: updatedVendor
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
