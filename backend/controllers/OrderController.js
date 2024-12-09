const Order = require("../models/OrderSchema");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  const { userId, products, deliveryAddress } = req.body;
  try {
    const order = await Order.create({ userId, products, deliveryAddress });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrders = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const orders = await Order.find({ userId }).populate("products");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "cancelled",
    "packed",
    "shipped",
    "delivered",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status provided" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changeOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, cancelledReason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "Invalid order ID format" });
  }

  const validStatuses = [
    "pending",
    "cancelled",
    "packed",
    "shipped",
    "delivered",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status provided" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, cancelledReason },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error changing order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Order.find();
//     res.status(200).json({ products });
//   } catch (error) {
//     console.error("Error retrieving products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderBySellerId = async (req, res) => {
  const { sellerId } = req.params;
  console.log("Searching for orders with sellerId:", sellerId);
  try {
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");

    const filteredOrders = orders.filter((order) =>
      order.products.some(
        (product) => product.productId.sellerId.toString() === sellerId
      )
    );

    console.log("Found orders:", filteredOrders);
    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error retrieving orders by seller ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orders = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving order by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const orders = await Order.find({ status })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderByDate = async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
      },
    })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders by date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ... existing code ...

exports.getOrdersByUserIdAndStatus = async (req, res) => {
  const { userId, status } = req.params;
  try {
    const orders = await Order.find({ userId, status })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders by user ID and status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrdersBySellerIdAndStatus = async (req, res) => {
  const { sellerId, status } = req.params;
  try {
    const orders = await Order.find({ status })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");

    const filteredOrders = orders.filter((order) =>
      order.products.some(
        (product) => product.productId.sellerId.toString() === sellerId
      )
    );

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error retrieving orders by seller ID and status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrdersByUserIdAndDate = async (req, res) => {
  const { userId, startDate, endDate } = req.params;
  try {
    const orders = await Order.find({
      userId,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
      },
    })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving orders by user ID and date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrdersBySellerIdAndDate = async (req, res) => {
  const { sellerId, startDate, endDate } = req.params;
  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
      },
    })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .populate("deliveryAddress")
      .populate("userId");

    const filteredOrders = orders.filter((order) =>
      order.products.some(
        (product) => product.productId.sellerId.toString() === sellerId
      )
    );

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error retrieving orders by seller ID and date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ... existing code ...
