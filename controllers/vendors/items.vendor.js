const Vendor = require("../../models/Vendor")
const MenuItem = require('../../models/MenuItem')
exports.AddMenuItem = async(req,res)=>{
    try{
        const {name,description,price,image,vendor} = req.body;
        if(!name||!description||!price||!image){
            return res.status(402).json({
                message:"Required full details"
            })
        }
        const new_item = await MenuItem.create({name,description,price,image,vendorId:vendor._id})
        res.status(200).json({
            message:"menu item created",
            item:new_item
        })

    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}
exports.DeleteItem = async (req,res)=>{
    try{
        const {id} =req.body;
        if(!id){
            return res.status(402).json({
                message:"Required id"
            })
        }
        const item = await MenuItem.findByIdAndDelete({id})
        res.status(200).json({
            message:"item deleted",
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}

exports.pauseItem=async(req,res)=>{
    try{
        const {id} =req.body;
        if(!id){
            return res.status(402).json({
                message:"Required id"
            })
        }
        const item = await MenuItem.findByIdAndUpdate(
            {id},
            { status: 'inactive' }, // Update the status to inactive
            {
                new: true, // Return the updated document
                runValidators: true, // Validate the update
            }
        );
        res.status(200).json({
            message:"item paused",
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}
exports.resumeItem=async(req,res)=>{
    try{
        const {id} =req.body;
        if(!id){
            return res.status(402).json({
                message:"Required id"
            })
        }
        const item = await MenuItem.findByIdAndUpdate(
            {id},
            { status: 'active' }, // Update the status to inactive
            {
                new: true, // Return the updated document
                runValidators: true, // Validate the update
            }
        );
        res.status(200).json({
            message:"item resumed",
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}
exports.getallitems = async(req,res)=>{
    try{
        const {_id} = req.vendor;
        const items = await MenuItem.find({vendorId:_id});
        if(!items){
            return res.status(400).json({
                message:"No items in menu"
            })
        }
        res.status(200).json({
            items,
        });

    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}