const Order = require('../../models/Order'); // Adjust the path as needed
const Cart = require('../../models/Cart'); // Adjust the path as needed
const User = require('../../models/User'); // Adjust the path as needed

exports.createOrder = async (req, res) => {
    try {
        const {  mobileNo,deliveryAddress } = req.body;
        console.log(mobileNo,deliveryAddress)
        const userId = req.user._id;
        // Input validation
        if (!userId || !mobileNo||!deliveryAddress ){
            return res.status(400).json({
                message: "Full data required."
            });
        }
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                message: "Cart not found or empty."
            });
        }
        const vendorId = cart.vendorID;
        // Find the user to get the delivery address
        const user1 = await User.findById(userId);
        if (!user1 ) {
            return res.status(404).json({
                message: "User not found or address not set."
            });
        }
        if(!user1.deliveryAddress){
            user1.deliveryAddress = deliveryAddress;
            await user1.save();
        }
        if(!user1.mobileNo){
            user1.mobileNo = mobileNo;
            await user1.save();
        }

        // Create the order
        const order = new Order({
            userId,
            vendorId,
            menuItems: cart.items,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            mobileNo,
            createdAt: new Date(),
        });
        // Save the order to the database
        await order.save();
        // Optionally, clear the cart after placing the order
        await Cart.deleteOne({ userId });
        res.status(201).json({
            message: "Order created successfully.",
            order
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
        });
    }
};



exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log(orderId)
        // Input validation
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required."
            });
        }

        // Find the order by ID and populate user and menu items
        const order = await Order.findById({_id:orderId})
            .populate('userId', 'name email') // Populate user details (adjust fields as needed)
            .populate('vendorId', 'name') // Populate vendor details (adjust fields as needed)
            .populate('menuItems.menuItem'); // Populate menu item details

        // Check if order exists
        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        // Respond with order details
        res.status(200).json({
            message: "Order details retrieved successfully.",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.getAllOrders = async(req,res)=>{
    try{
        const user = req.user;
        const id = user._id;
        const orders = await Order.find({userId:id}).populate('userId').populate('vendorId');
        res.status(200).json({
            message: "Orders retrieved successfully.",
            data:orders
            });

    }catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}