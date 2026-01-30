const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all alerts for the logged-in user's fields
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT alerts.id, alerts.type, alerts.message, alerts.created_at, alerts.field_id, fields.name as field_name
       FROM alerts JOIN fields ON alerts.field_id = fields.id
       WHERE fields.user_id = $1
       ORDER BY alerts.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new alert (for testing/demo)
router.post('/', authMiddleware, async (req, res) => {
  const { field_id, type, message } = req.body;
  if (!field_id || !type || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    const result = await pool.query(
      'INSERT INTO alerts (field_id, type, message) VALUES ($1, $2, $3) RETURNING *',
      [field_id, type, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
