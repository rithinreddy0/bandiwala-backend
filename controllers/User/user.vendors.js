const MenuItem = require("../../models/MenuItem");
const Vendor = require("../../models/Vendor");

exports.getAllVendors= async(req,res)=>{
    try{
        const data = await Vendor.find();
        res.status(200).json({
            data
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
}
exports.getVendorDetails = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ // Use 400 for bad request
                message: "Restaurant ID required"
            });
        }
        const data = await Vendor.findById(id);
        if (!data) { // Check if the vendor was found
            return res.status(404).json({
                message: "Vendor not found"
            });
        }

        
        const menu = await MenuItem.find({ vendorId: id });
        data.menu = menu;
        res.status(200).json({
            data
        });
        
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};
