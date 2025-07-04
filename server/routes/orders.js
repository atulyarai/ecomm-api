const express = require("express");
const orders = require("../models/orders");
const carts = require("../models/carts");
const authenticateJWT = require("../middlewares/auth");
const requireRole = require("../middlewares/roles");
const router = express.Router();

// Create order from cart (customer only)
router.post("/", authenticateJWT, (req, res) => {
  if (req.user.role !== "customer")
    return res.status(403).json({ message: "Only customers can place orders" });
  const userId = req.user.id;
  const cart = carts[userId];
  if (!cart || cart.length === 0)
    return res.status(400).json({ message: "Cart is empty" });
  const order = {
    id: orders.length + 1,
    userId,
    items: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    timestamp: new Date().toISOString(),
  };
  orders.push(order);
  carts[userId] = [];
  res.status(201).json(order);
});

// Get orders (customer: own, admin: all)
router.get("/", authenticateJWT, (req, res) => {
  if (req.user.role === "admin") {
    res.json(orders);
  } else {
    res.json(orders.filter((o) => o.userId === req.user.id));
  }
});

module.exports = router;
