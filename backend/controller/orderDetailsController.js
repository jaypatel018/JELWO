import OrderDetails from "../modal/OrderDetails.js";

export const getAllOrderDetails = async (req, res) => {
  try {
    const orders = await OrderDetails.find()
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrderDetails = async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const orders = await OrderDetails.find({ clerkUserId })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order (/api/orders/order/:orderId)
export const getOrderDetailById = async (req, res) => {
  try {
    const order = await OrderDetails.findById(req.params.orderId)
      .populate('products.productId');
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status - Admin (/api/orders/order/:orderId/status)
export const updateOrderDetailStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await OrderDetails.findByIdAndUpdate(
      req.params.orderId,
      { status, ...(trackingNumber && { trackingNumber }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order (/api/orders/order/:orderId/cancel)
export const cancelOrderDetail = async (req, res) => {
  try {
    const order = await OrderDetails.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
