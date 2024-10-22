// routes/userRoutes.js
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/User/authController');
const { resetPassword, requestPasswordReset, verifyOTP } = require('../controllers/User/resetPassword');

const UserRouter = express.Router();

// Signup Route
UserRouter.post('/signup', authController.signup);

// OTP Verification Route
UserRouter.post('/verify-otp', authController.verifyOTP);
UserRouter.post('/reset-password',resetPassword);
UserRouter.post('/request-password-reset',requestPasswordReset);
UserRouter.post('/verify-password-reset',verifyOTP);
// Login Route
UserRouter.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], authController.login );

module.exports = UserRouter;
