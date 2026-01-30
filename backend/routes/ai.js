const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

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

// Analyze field using FastAPI AI service
router.post('/analyze', authMiddleware, async (req, res) => {
  const { field_id, image_url } = req.body;
  if (!field_id || !image_url) return res.status(400).json({ error: 'Missing field_id or image_url' });
  try {
    // Call FastAPI service
    const response = await axios.post('http://localhost:8000/analyze-field', {
      field_id,
      image_url
    });
    res.json(response.data);
  } catch (err) {
    console.error('AI service error:', err.message);
    res.status(500).json({ error: 'AI service error' });
  }
});

module.exports = router;
