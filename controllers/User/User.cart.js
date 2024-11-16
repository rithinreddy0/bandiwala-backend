const Cart = require('../../models/Cart'); 
const MenuItem = require('../../models/MenuItem'); 

exports.addToCart = async (req, res) => {
    try {
      const { menuItemId, quantity } = req.body;
      const userId = req.user._id;  // Assuming you're using a middleware to populate req.user
  
      // Input validation
      if (!userId || !menuItemId || quantity === undefined) {
        return res.status(400).json({
          message: "User ID, menu item ID, and quantity are required"
        });
      }
  
      // Find the menu item
      const menuItem = await MenuItem.findById(menuItemId);
      if (!menuItem) {
        return res.status(400).json({
          message: "Menu item not found."
        });
      }
  
      // Find the cart for the user
      let cart = await Cart.findOne({ userId });
  
      // Calculate the total price for this item (price per item * quantity)
      const totalPrice = menuItem.price * quantity;
  
      if (cart) {
        // Check if the item can be added based on vendor ID
        if (!menuItem.vendorId.equals(cart.vendorID)) {
          return res.status(400).json({
            message: "You can't add items from different vendors to the same cart"
          });
        }
  
        // Find the index of the menu item in the cart
        const itemIndex = cart.items.findIndex(item => item.menuItem.equals(menuItemId));
  
        if (itemIndex > -1) {
          // Item exists in the cart, update the quantity
          const currentItem = cart.items[itemIndex];
  
          // Recalculate the total amount by removing the old price and adding the new one
          const oldTotalPrice = currentItem.quantity * menuItem.price;
          cart.totalAmount -= oldTotalPrice;  // Subtract the old amount
          
          currentItem.quantity = quantity;  // Update the quantity to the one received from the user
          
          const newTotalPrice = currentItem.quantity * menuItem.price;
          cart.totalAmount += newTotalPrice; // Add the new total price for the item
  
          // If the new quantity is zero or negative, remove the item from the cart
          if (currentItem.quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          }
        } else {
          // Item doesn't exist in the cart, add it with the new quantity
          cart.items.push({ menuItem: menuItemId, quantity });
  
          // Add the price of the new item to the total amount
          cart.totalAmount += totalPrice;
        }
      } else {
        // If the cart doesn't exist, create a new cart
        cart = new Cart({
          userId,
          items: [{ menuItem: menuItemId, quantity }],
          totalAmount: totalPrice,
          vendorID: menuItem.vendorId
        });
      }
  
      // Check if all items in the cart have quantity 0 or less
      const allItemsZero = cart.items.every(item => item.quantity <= 0);
  
      // If all items have quantity 0 or less, delete the cart
      if (allItemsZero) {
        await Cart.findByIdAndDelete(cart._id);  // Delete the cart if empty
        return res.status(200).json({
          message: "All items removed, cart has been deleted.",
          bill: {}
        });
      }
  
      // Save the cart
      await cart.save();
  
      // Prepare the bill details to send to frontend
      const billDetails = {
        items: cart.items,
        totalAmount: cart.totalAmount,
      };
  
      // Respond with success
      res.status(200).json({
        message: "Cart updated successfully.",
        bill: billDetails,
      });
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  };
  
exports.getCartDetails = async (req, res) => {
    try {
        const user= req.user;
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
exports.removeItemFromCart = async (req, res) => {
    try {
      const { menuItemId } = req.body; // Assuming userId and menuItemId are sent in the request body
        const userId = req.user._id;
      // Validate input
      if (!userId || !menuItemId) {
        return res.status(400).json({ message: 'userId and menuItemId are required' });
      }
  
      // Find the cart for the user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this user' });
      }
  
      // Check if the item exists in the cart
      const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId.toString());
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in the cart' });
      }
  
      // Remove the item from the items array
      cart.items.splice(itemIndex, 1);
  
      // Recalculate totalAmount
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * (item.menuItem.price || 0)); // Assuming price is part of MenuItem
      }, 0);
  
      // Save the updated cart
      await cart.save();
  
      return res.status(200).json({
        message: 'Item removed from cart successfully',
        cart: cart, // Optionally send back the updated cart object
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };