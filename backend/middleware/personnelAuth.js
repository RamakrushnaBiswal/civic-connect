const jwt = require('jsonwebtoken');
require('dotenv').config();

const personnelAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // expect decoded to contain { id: personnelId, role: 'personnel' }
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });
    req.personnel = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = personnelAuth;
