const db = require('../config/database');

exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = `
      SELECT t.*, u.name as requester_name, u.email as requester_email, u.department as requester_department
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    // If not admin, only show user's own tickets
    if (userRole !== 'admin') {
      params.push(userId);
      query += ` AND t.user_id = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }
    
    if (priority) {
      params.push(priority);
      query += ` AND t.priority = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (t.subject ILIKE $${params.length} OR t.description ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY t.created_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT t.*, u.name as requester_name, u.email as requester_email, u.department as requester_department
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const userId = req.user.id;
    
    const result = await db.query(
      `INSERT INTO tickets (subject, description, priority, source, user_id, status)
       VALUES ($1, $2, $3, 'manual', $4, 'open')
       RETURNING *`,
      [subject, description, priority || 'medium', userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to } = req.body;
    
    const result = await db.query(
      `UPDATE tickets 
       SET status = COALESCE($1, status),
           priority = COALESCE($2, priority),
           assigned_to = COALESCE($3, assigned_to),
           resolved_at = CASE WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END,
           closed_at = CASE WHEN $1 = 'closed' THEN CURRENT_TIMESTAMP ELSE closed_at END
       WHERE id = $4
       RETURNING *`,
      [status, priority, assigned_to, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const author = req.user.name;
    
    const result = await db.query(
      'INSERT INTO comments (ticket_id, author, text) VALUES ($1, $2, $3) RETURNING *',
      [id, author, text]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC',
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};