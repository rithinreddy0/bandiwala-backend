const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Transporter for sending OTP emails (replace with phone OTP API if needed)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = (otp,email)=>{
  const mailOptions = {
    from: 'your-email@gmail.com',
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
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user){ 
          if(user.isVerified==false){
            try{
              const otp = generateOTP();
              const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 10 minutes
              const update = await  User.findOneAndUpdate({email},{otp,otpExpires});
              sendMail(otp,user.email)
              return res.status(202).json({
                message:"User not verified New otp updated"
              })
            }
            catch(error){
              return res.status(400).json({
                message:"Internal server error",
                error:error.message
              })
            }
            
          }
          return res.status(400).json({ message: 'User already exists' });
        }

        // Create OTP and its expiration time
        const otp = generateOTP();
        const otpExpires = new Date( Date.now() + 5 * 60 * 1000); // OTP expires in 10 minutes
        // console.log(Date.now() + 5 * 60 * 1000)
        // Create new user but not verified yet
        user = new User({
            name,
            email,
            password,
            otp,
            otpExpires
        });

         await user.save();

        // Send OTP via email (or you can use an SMS API for phone verification)
        sendMail(otp,user.email)

        res.status(200).json({ message: 'OTP sent to email for verification' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        console.log(user.otp,otp);
        // Check if OTP is valid and not expired
        if (user.otp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User does not exist' });

        // Check if the user is verified
        if (!user.isVerified) return res.status(400).json({ message: 'User is not verified' });

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token as a cookie
        res.cookie('userToken', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(200).json({ 
          message: 'Logged in successfully' ,
          token
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};
