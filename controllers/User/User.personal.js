const User = require('../../models/User'); // Adjust the path as needed

exports.updateAddress = async (req, res) => {
    try {
        const { user, address } = req.body;

        // Check for required fields
        if (!user._id || !address || !address.roomNo || !address.block || !address.phoneNumber || !address.landmark) {
            return res.status(400).json({
                message: "User ID and complete address fields (roomNo, block, phoneNumber, landmark) are required"
            });
        }

        // Find the user by ID
        const user1 = await User.findById(user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update or set the address
        user1.address = {
            roomNo: address.roomNo,
            block: address.block,
            phoneNumber: address.phoneNumber,
            landmark: address.landmark
        };

        // Save the updated user
        await user1.save();

        res.status(200).json({
            message: "Address updated successfully",
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
exports.getUserDeliveryDeatils = async(req,res)=>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
    const deliveryAddress = user.deliveryAddress;
    const mobileNo = user.mobileNo;
    return res.status(200).json({
        message: "User delivery details",
        data: {
            deliveryAddress,
            mobileNo
        }
    })
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}