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

// Get all fields for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, ST_AsGeoJSON(geom) as geom FROM fields WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new field
router.post('/', authMiddleware, async (req, res) => {
  const { name, geom } = req.body;
  if (!name || !geom) return res.status(400).json({ error: 'Missing name or geometry' });
  try {
    const result = await pool.query(
      'INSERT INTO fields (user_id, name, geom) VALUES ($1, $2, ST_GeomFromGeoJSON($3)) RETURNING id, name, ST_AsGeoJSON(geom) as geom',
      [req.user.id, name, JSON.stringify(geom)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
