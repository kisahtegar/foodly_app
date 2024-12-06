const Order = require("../models/Order");

module.exports = {
  placeOrder: async (req, res) => {
    const order = new Order(req.body);

    try {
      await order.save();
      res
        .status(201)
        .json({ status: true, message: "Order saved successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getOrderDetails: async (req, res) => {
    const orderId = req.params.id;

    try {
      const order = await Order.findById(orderId)
        .populate({
          path: "userId",
          select: "name email phone",
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city state postalCode",
        })
        .populate({
          path: "restaurantId",
          select: "name location",
        })
        .populate({
          path: "driverId",
          select: "name phone",
        });

      if (order) {
        res.status(200).json(order);
      } else
        res.status(404).json({ status: false, message: "Order not found" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getUserOrders: async (req, res) => {
    const userId = req.user.id;

    try {
      const orders = await Order.find({ userId })
        .populate({
          path: "restaurantId",
          select: "name location imageUrl",
        })
        .populate({
          path: "driverId",
          select: "name phone",
        });

      if (orders) {
        res.status(200).json(orders);
      } else
        res.status(404).json({ status: false, message: "No orders found" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  rateOrder: async (req, res) => {
    const orderId = req.params.id;
    const { rating, feedback } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { rating, feedback },
        { new: true }
      );

      if (updatedOrder) {
        res
          .status(200)
          .json({ status: true, message: "Order Updated Successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to Update order" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );

      if (updatedOrder) {
        res
          .status(200)
          .json({ status: true, message: "Order Status Updated Successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to Update order" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  updatePaymentStatus: async (req, res) => {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );

      if (updatedOrder) {
        res.status(200).json({
          status: true,
          message: "Payment Status Updated Successfully",
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to Update payment status" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
