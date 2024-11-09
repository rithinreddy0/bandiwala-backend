const express = require('express');
const { vendorSignup, vendorLogin,verifyVendorOTP } = require('../controllers/vendors/auth.vendor.controller');
const { AddMenuItem, DeleteItem, pauseItem, resumeItem } = require('../controllers/vendors/items.vendor');
const { isVendor } = require('../middlewares/isVendor');
const { requestPasswordReset, verifyOTP, resetPassword } = require('../controllers/vendors/ResetVendor');
const VendorRouter = express.Router();
//AUTHENTICATION ROUTES
VendorRouter.post("/signup",vendorSignup)
VendorRouter.post("/login",vendorLogin)
VendorRouter.post("/verify-otp",verifyVendorOTP)
//MENU ROUTES
VendorRouter.post("/additem",isVendor,AddMenuItem)
VendorRouter.post("/deleteitem",isVendor,DeleteItem)
VendorRouter.post("/pauseitem",isVendor,pauseItem)
VendorRouter.post("/resumeitem",isVendor,resumeItem)
//FORGET PASSWORD ROUTES
VendorRouter.post('/request-password-reset',requestPasswordReset);
VendorRouter.post('/verify-password-reset',verifyOTP);
VendorRouter.post('/reset-password',resetPassword);
module.exports = VendorRouter;