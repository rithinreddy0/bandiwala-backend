const Order = require("../../models/Order");

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required." });
    }

    // Fetch orders, filter out Delivered and Cancelled orders
    const orders = await Order.find({
      vendorId,
      status: { $nin: ['Delivered', 'Cancelled'] }, // Filter out Delivered and Cancelled statuses
    })
      .populate("userId")
      .populate("menuItems.menuItem");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
