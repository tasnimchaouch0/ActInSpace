const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Fields routes
const fieldsRoutes = require('./routes/fields');
app.use('/api/fields', fieldsRoutes);

// Alerts routes
const alertsRoutes = require('./routes/alerts');
app.use('/api/alerts', alertsRoutes);

// AI routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('GreenSignal backend API running');
});

// TODO: Add routes for fields, alerts, users, payments

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
