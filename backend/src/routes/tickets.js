const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Get all tickets
router.get('/', ticketController.getAllTickets);

// Get single ticket
router.get('/:id', ticketController.getTicket);

// Create ticket
router.post('/', ticketController.createTicket);

// Update ticket
router.put('/:id', ticketController.updateTicket);

// Delete ticket
router.delete('/:id', ticketController.deleteTicket);

// Add comment
router.post('/:id/comments', ticketController.addComment);

// Get comments
router.get('/:id/comments', ticketController.getComments);

module.exports = router;