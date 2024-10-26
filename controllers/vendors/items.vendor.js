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
exports.Getall= async(req,res)=>{
    try{
        const data = await MenuItem.find();
        res.status(200).json({
            data
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}