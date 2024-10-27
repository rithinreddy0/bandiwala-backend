const Vendor = require("../../models/Vendor")
const MenuItem = require('../../models/MenuItem')
exports.AddMenuItem = async(req,res)=>{
    try{
        const {name,description,price,category,image} = req.body;
        if(!name||!description||!price||!category){
            return res.status(402).json({
                message:"Required full details"
            })
        }
        const new_item = await MenuItem.create({name,description,price,image,category

        })
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