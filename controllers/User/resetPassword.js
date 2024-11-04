const nodemailer = require('nodemailer');
const User = require('../../models/User'); // Assuming you have a User model
require('dotenv').config();
const bcrypt = require('bcrypt');

// Generate a 6-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Example: 1234
}

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP and expiry
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        await user.save();

        // Send OTP to user via email
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        let mailOptions = {
            from: 'youremail@gmail.com',
            to: user.email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. It is valid for 5 minutes.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'OTP sent to your email!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find user by email and validate OTP
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify OTP and check expiry
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, allow password reset
        res.status(200).json({ message: 'OTP verified. Proceed to reset password.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the password and clear OTP
        user.password = hashedPassword;
        user.otp = undefined;  // Clear OTP
        user.otpExpiry = undefined;  // Clear expiry
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
