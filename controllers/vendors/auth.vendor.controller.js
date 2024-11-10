const nodemailer = require('nodemailer');
const Vendor = require("../../models/Vendor")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');




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
  const {email,password,phone,address,restaurantName} = req.body;

  try {
      // Check if user already exists
      let user = await Vendor.findOne({ email });
      
      if (user) { 
          if (!user.isVerified) {
              try {
                  const otp = generateOTP();
                  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

                  // Update the OTP and expiration for the unverified user
                  await Vendor.findOneAndUpdate({ email }, { otp, otpExpires });
                  sendMail(otp, user.email);

                  // Return 200 since this is a successful flow for unverified user re-sending OTP
                  return res.status(200).json({
                      message: "User not verified. New OTP sent to email."
                  });
              } catch (error) {
                  return res.status(500).json({
                      message: "Internal server error",
                      error: error.message
                  });
              }
          }
          // Return 400 if the user exists and is already verified
          return res.status(400).json({ message: 'User already exists, please sign in.' });
      }

      // Create OTP and expiration time for a new user
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

      // Create a new user entry
      user = new Vendor({
        email,password,phone,address,restaurantName
      });

      await user.save();

      // Send OTP to email
      sendMail(otp, user.email);

      // Return 201 for successful user creation with OTP
      return res.status(201).json({ message: 'OTP sent to email for verification' });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
  }
};
exports.verifyVendorOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await Vendor.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        // console.log(user.otp,otp);
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


exports.vendorLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Invalid Details"
            })
        }
        const existing_user = await Vendor.findOne({email})
        if(!existing_user){
            return res.status(400).json({
                message:"User doesnot exists"
            })
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
            message:"Login successfull",
            user:payload,
            token
        })

    }catch(e){
        console.log(e.message)
        res.status(500).json({
            message:e.message
        })
    }
}