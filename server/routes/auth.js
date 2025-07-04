const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// In-memory users array (imported from server.js in a real app)
const users = require("../models/users");

const JWT_SECRET = "your_jwt_secret"; // Use env var in production

// Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (users.find((u) => u.username === username))
    return res.status(409).json({ message: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    username,
    password: hashed,
    role: role || "customer",
  };
  users.push(user);
  res.status(201).json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

module.exports = router;
