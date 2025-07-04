const express = require("express");
const products = require("../models/products");
const authenticateJWT = require("../middlewares/auth");
const requireRole = require("../middlewares/roles");
const router = express.Router();

// List all products (public, with pagination and search)
router.get("/", (req, res) => {
  let { page = 1, limit = 10, name, category } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let filtered = products;
  if (name) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (category) {
    filtered = filtered.filter(
      (p) =>
        p.category && p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  res.json({
    page,
    limit,
    total: filtered.length,
    products: paginated,
  });
});

// Add product (admin only)
router.post("/", authenticateJWT, requireRole("admin"), (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: "Name and price required" });
  const product = {
    id: products.length + 1,
    name,
    price,
    category: category || "",
  };
  products.push(product);
  res.status(201).json(product);
});

// Update product (admin only)
router.put("/:id", authenticateJWT, requireRole("admin"), (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const { name, price, category } = req.body;
  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;
  res.json(product);
});

// Delete product (admin only)
router.delete("/:id", authenticateJWT, requireRole("admin"), (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

module.exports = router;
