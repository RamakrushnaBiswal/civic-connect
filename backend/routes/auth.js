const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

// Start Google OAuth flow
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: 160 * 60 * 24 // 1 day
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/signup?token=${token}`);
  }
);

module.exports = router;
