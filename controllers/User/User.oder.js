const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const User = require("../../models/User");

// Utility function for validation errors
const handleValidationError = (res, message) => {
  return res.status(400).json({ message });
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { mobileNo, deliveryAddress } = req.body;
    const userId = req.user?._id;

    if (!userId || !mobileNo || !deliveryAddress) {
      return handleValidationError(res, "User ID, mobile number, and delivery address are required.");
    }

    // Check for cart
    const cart = await Cart.findOne({ userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty." });
    }

    // Update user data if necessary
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update missing details
    if (!user.deliveryAddress) user.deliveryAddress = deliveryAddress;
    if (!user.mobileNo) user.mobileNo = mobileNo;
    await user.save();

    // Create the order
    const order = new Order({
      userId,
      vendorId: cart.vendorID,
      menuItems: cart.items,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      mobileNo,
      createdAt: new Date(),
    });

    // Save the order
    await order.save();

    // Clear the user's cart
    await Cart.deleteOne({ userId });

    // Notify the frontend or other services via Socket.IO
    req.app.get("socketio").emit("orderUpdate", { action: "created", order });

    res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get details of a specific order
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return handleValidationError(res, "Order ID is required.");
    }

    // Fetch the order and populate related data
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("vendorId", "name")
      .populate("menuItems.menuItem", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order details retrieved successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in getOrderDetails:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all orders for the authenticated user
exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return handleValidationError(res, "User ID is required.");
    }

    // Fetch all orders for the user
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sort by latest orders first
      .populate("vendorId", "name")
      .populate("menuItems.menuItem", "name price");

    res.status(200).json({
      message: "Orders retrieved successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return handleValidationError(res, "Order ID and status are required.");
    }

    // Validate status values
    const validStatuses = ['Order Placed', 'Preparing',"On the Way", 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return handleValidationError(res, "Invalid status value.");
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    )
      .populate("userId", "name email")
      .populate("vendorId", "name")
      .populate("menuItems.menuItem", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Notify frontend about the updated status via Socket.IO
    req.app.get("socketio").emit("orderUpdate", { action: "updated", order });

    res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
