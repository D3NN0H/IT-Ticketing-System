const express = require('express');
const router = express.Router();

// Placeholder for Gmail integration
router.post('/webhook', (req, res) => {
  console.log('Gmail webhook received:', req.body);
  res.json({ message: 'Webhook received' });
});

router.get('/auth', (req, res) => {
  res.json({ message: 'Gmail auth endpoint' });
});

module.exports = router;