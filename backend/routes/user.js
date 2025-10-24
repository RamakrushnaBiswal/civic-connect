const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Logout Route
router.post('/logout', (req, res) => {
  // Clear the cookie or instruct client to remove token
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

// Get User Profile
router.get('/user/profile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
