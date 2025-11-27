const jwt = require('jsonwebtoken');

// Verify JWT token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // { id, email, role }
    next();
  });
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if user owns the resource or is admin
exports.isOwnerOrAdmin = async (req, res, next) => {
  const ticketId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole === 'admin') {
    return next();
  }

  try {
    const db = require('../config/database');
    const result = await db.query('SELECT user_id FROM tickets WHERE id = $1', [ticketId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};