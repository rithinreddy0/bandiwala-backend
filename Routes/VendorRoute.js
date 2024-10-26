const express = require('express');
const { vendorSignup, vendorLogin } = require('../controllers/vendors/auth.vendor.controller');
const { AddMenuItem, Getall } = require('../controllers/vendors/items.vendor');
const VendorRouter = express.Router();
VendorRouter.post("/signup",vendorSignup)
VendorRouter.post("/login",vendorLogin)
VendorRouter.post("/additem",AddMenuItem)
VendorRouter.get("/getall",Getall)
module.exports = VendorRouter;