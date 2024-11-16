const Cart = require('../../models/Cart'); 
const MenuItem = require('../../models/MenuItem'); 

exports.addToCart = async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;
        const userId=req.user._id;
        // Input validation
        if (!userId || !menuItemId || !quantity) {
            return res.status(400).json({
                message: "User ID, menu item ID, and quantity are required."
            });
        }
        // Find the menu item
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found."
            });
        }
        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        console.log(cart)
        // Calculate total price
        const totalPrice = menuItem.price * quantity;
        if (cart) {
            // Update the existing cart
            console.log(menuItem.vendorId,cart.vendorID)
            if(!menuItem.vendorId.equals(cart.vendorID)){
                return res.status(400).json({
                    message: "You can't add items from different vendors to the same cart"
                });
            }
            const itemIndex = cart.items.findIndex(item => item.menuItem.equals(menuItemId));

            if (itemIndex > -1) {
                // Update quantity if the item exists
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item to the cart
                cart.items.push({ menuItem: menuItemId, quantity });
            }

            // Recalculate total amount
            cart.totalAmount += totalPrice;
        } else {
            // Create a new cart if it doesn't exist
            cart = new Cart({
                userId,
                items: [{ menuItem: menuItemId, quantity }],
                totalAmount: totalPrice,
                vendorID:menuItem.vendorId
            });
        }
        // Save the cart
        await cart.save();
        // Prepare the bill details to send to frontend
        const billDetails = {
            items: cart.items,
            totalAmount: cart.totalAmount,
        };
        res.status(200).json({
            message: "Item added to cart successfully.",
            bill: billDetails,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


exports.getCartDetails = async (req, res) => {
    try {
        const { user } = req.body;
        const userId = user._id;
        // Input validation
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }

        // Find the user's cart and populate menu items
        const cart = await Cart.findOne({ userId }).populate('items.menuItem');

        // Check if cart exists
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found."
            });
        }

        // Respond with cart details
        res.status(200).json({
            message: "Cart details retrieved successfully.",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


exports.deleteCart = async (req, res) => {
    try {
        const { user} = req.body;
        const userId = user._id;
        // Input validation
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }

        // Find and delete the cart
        const deletedCart = await Cart.findOneAndDelete({ userId });

        // Check if cart was found and deleted
        if (!deletedCart) {
            return res.status(404).json({
                message: "Cart not found."
            });
        }

        // Successful deletion response
        res.status(200).json({
            message: "Cart deleted successfully.",
            deletedCart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
