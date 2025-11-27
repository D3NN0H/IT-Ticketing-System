const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken, isAdmin, isOwnerOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all tickets (admin sees all, users see only their own)
router.get('/', ticketController.getAllTickets);

// Get single ticket (owner or admin only)
router.get('/:id', isOwnerOrAdmin, ticketController.getTicket);

// Create ticket (any authenticated user)
router.post('/', ticketController.createTicket);

// Update ticket (owner or admin only)
router.put('/:id', isOwnerOrAdmin, ticketController.updateTicket);

// Delete ticket (admin only)
router.delete('/:id', isAdmin, ticketController.deleteTicket);

// Add comment (owner or admin only)
router.post('/:id/comments', isOwnerOrAdmin, ticketController.addComment);

// Get comments (owner or admin only)
router.get('/:id/comments', isOwnerOrAdmin, ticketController.getComments);

module.exports = router;