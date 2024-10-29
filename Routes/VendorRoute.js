const express = require('express');
const { vendorSignup, vendorLogin } = require('../controllers/vendors/auth.vendor.controller');
const { AddMenuItem, DeleteItem, pauseItem, resumeItem } = require('../controllers/vendors/items.vendor');
const { isVendor } = require('../middlewares/isVendor');
const VendorRouter = express.Router();
//AUTHENTICATION ROUTES
VendorRouter.post("/signup",vendorSignup)
VendorRouter.post("/login",vendorLogin)
//MENU ROUTES
VendorRouter.post("/additem",isVendor,AddMenuItem)
VendorRouter.post("/deleteitem",isVendor,DeleteItem)
VendorRouter.post("/pauseitem",isVendor,pauseItem)
VendorRouter.post("/resumeitem",isVendor,resumeItem)

module.exports = VendorRouter;