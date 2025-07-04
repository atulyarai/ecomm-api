const express = require("express");
const carts = require("../models/carts");
const products = require("../models/products");
const authenticateJWT = require("../middlewares/auth");
const router = express.Router();

// Get current user's cart
router.get("/", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  res.json(carts[userId] || []);
});

// Add or update item in cart
router.post("/", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1)
    return res
      .status(400)
      .json({ message: "ProductId and positive quantity required" });
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (!carts[userId]) carts[userId] = [];
  const item = carts[userId].find((i) => i.productId === productId);
  if (item) {
    item.quantity = quantity;
  } else {
    carts[userId].push({ productId, quantity });
  }
  res.json(carts[userId]);
});

// Remove item from cart
router.delete("/:productId", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);
  if (!carts[userId])
    return res.status(404).json({ message: "Cart not found" });
  carts[userId] = carts[userId].filter((i) => i.productId !== productId);
  res.json(carts[userId]);
});

module.exports = router;
