// routes/userRoutes.js
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/User/authController');
const { resetPassword, requestPasswordReset, verifyOTP } = require('../controllers/User/resetPassword');
const { updateAddress, getUserDeliveryDeatils } = require('../controllers/User/User.personal');
const { getAllVendors, getVendorDetails } = require('../controllers/User/user.vendors');
const { addToCart, getCartDetails, deleteCart } = require('../controllers/User/User.cart');
const { createOrder, getOrderDetails, getAllOrders,updateOrderStatus } = require('../controllers/User/User.oder');
const { searchMenuItems } = require('../controllers/User/User.search');
const { addReview } = require('../controllers/User/User.rating');
const { isUser } = require('../middlewares/isUser');
const { getAlgorithms } = require('json-web-token');

const UserRouter = express.Router();

// Signup Route
UserRouter.post('/signup', authController.signup);
UserRouter.post('/verify-otp', authController.verifyOTP);

// Login Route
UserRouter.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], authController.login );

// OTP Verification Route
UserRouter.post('/request-password-reset',requestPasswordReset);
UserRouter.post('/verify-password-reset',verifyOTP);
UserRouter.post('/reset-password',resetPassword);

//addressa and phone no
UserRouter.post('/getdeliverydeatils',isUser,getUserDeliveryDeatils)

//updating profile
UserRouter.post("/updateAddresss",isUser,updateAddress)

//vendor details routes
UserRouter.post("/getAllVendors",getAllVendors)
UserRouter.post("/getVendorDetails",getVendorDetails)

//cart routes
UserRouter.post("/addToCart",isUser,addToCart)
UserRouter.post("/deleteCart",isUser,deleteCart)
UserRouter.post("/getCartDetails",isUser,getCartDetails)

//order Routes
UserRouter.post("/createOrder",isUser,createOrder)
UserRouter.post("/getOrderDetails",isUser,getOrderDetails)
UserRouter.post("/getallorders",isUser,getAllOrders)
userRouter.Post("/updateOrderStatus",isUser,updateOrderStatus)

//searching routes
UserRouter.post("/searchAllItems",searchMenuItems)

//review routes
UserRouter.post("/addReview",isUser,addReview)
//verify
UserRouter.post("/verify",isUser,(req,res)=>{
  res.status(200).json({
      message:"user verified"
  })
}) 
module.exports = UserRouter;
