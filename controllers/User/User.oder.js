const Order = require('../../models/Order'); // Adjust the path as needed
const Cart = require('../../models/Cart'); // Adjust the path as needed
const User = require('../../models/User'); // Adjust the path as needed

exports.createOrder = async (req, res) => {
    try {
        const { user1, vendorId } = req.body;
        const userId = user1._id;
        // Input validation
        if (!userId || !vendorId) {
            return res.status(400).json({
                message: "User ID and vendor ID are required."
            });
        }
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                message: "Cart not found or empty."
            });
        }
        // Find the user to get the delivery address
        const user = await User.findById(userId);
        if (!user || !user.address) {
            return res.status(404).json({
                message: "User not found or address not set."
            });
        }
        // Use the delivery address from the user's address
        const deliveryAddress = `${user.address.roomNo}, Block ${user.address.block}, Landmark: ${user.address.landmark}`;
        // Create the order
        const order = new Order({
            userId,
            vendorId,
            menuItems: cart.items,
            totalAmount: cart.totalAmount,
            deliveryAddress,
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
        return res.status(500).json({
            message: error.message,
        });
    }
};



exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Input validation
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required."
            });
        }

        // Find the order by ID and populate user and menu items
        const order = await Order.findById(orderId)
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
