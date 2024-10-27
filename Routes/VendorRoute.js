const express = require('express');
const { vendorSignup, vendorLogin } = require('../controllers/vendors/auth.vendor.controller');
const { AddMenuItem, DeleteItem, pauseItem, resumeItem } = require('../controllers/vendors/items.vendor');
const VendorRouter = express.Router();
VendorRouter.post("/signup",vendorSignup)
VendorRouter.post("/login",vendorLogin)
VendorRouter.post("/additem",AddMenuItem)
VendorRouter.post("/deleteitem",DeleteItem)
VendorRouter.post("/pauseitem",pauseItem)
VendorRouter.post("/resumeitem",resumeItem)


module.exports = VendorRouter;