const express = require('express');
const router = express.Router();

// Placeholder for WhatsApp integration
router.post('/webhook', (req, res) => {
  console.log('WhatsApp webhook received:', req.body);
  res.json({ message: 'Webhook received' });
});

module.exports = router;