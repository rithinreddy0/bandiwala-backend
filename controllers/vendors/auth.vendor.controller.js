const Vendor = require("../../models/Vendor")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

exports.vendorSignup = async (req,res)=>{
    try{
        const {email,password,phone,address,restaurantName} = req.body;
        if(!email||!password||!phone||!address||!restaurantName){
            return res.status(400).json({
                message:"All feilds are required"
            })
        }
        const previous_user = await Vendor.findOne({email,phone})
        if(previous_user){
            return res.status(400).json({
                message:"User already Exists"
            })
        }
        const hashed_password = await bcrypt.hash(password,10);
        const user = await Vendor.create({email,password:hashed_password,phone,address,restaurantName});
        res.status(200).json({
            message:"restaurant created",
            user:user,
        })
    }catch(e){
        console.log(e.message)
        res.status(500).json({
            message:e.message
        })
    }
}
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
        const token = jwt.sign(payload, secretKey);
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