const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { supplierId, products } = req.body;
    const newOrder = new Order({
      supplierId,
      products,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ error: "Error creating order", details: error.message });
  }
});

// if status ={} so all order, if not depends.
router.get("/all", async (req, res) => {
  try {
    const { status } = req.query; 
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate("supplierId").populate("products.productId");
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving orders" });
  }
});

router.get("/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;
    const orders = await Order.find({ supplierId }).populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "error to get orders" });
  }
});

router.patch("/confirm/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== "completed") {
      return res.status(400).json({ error: "Only 'completed' status is allowed" });
    }
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status: "completed" }, { new: true });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
});

router.patch("/notificationSeen/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { notificationSeen: true },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error updating notification status" });
  }
});

router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    order.status = "in-process";
    await order.save();

    res.status(200).json({ message: "order become in-process" });
  } catch (error) {
    res.status(500).json({ error: "error on update order" });
  }
});

module.exports = router;
