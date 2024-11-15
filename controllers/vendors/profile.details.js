const Vendor = require("../../models/Vendor")

exports.getvendorDetails = async(req,res)=>{
    try{
        const {_id} = req.vendor;
        if(!_id){
            return res.status(410).json({
                message:"Vendor not found"
            })
        }
        const vendor = await Vendor.findById(_id)
        return res.status(200).json({
            data:vendor
        })

    }catch(Err){
        return res.status(410).json({
            message:Err.message
        })
    }
}