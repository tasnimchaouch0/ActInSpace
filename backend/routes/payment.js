const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

// Process Payment and Upgrade User
router.post('/process', verifyToken, async (req, res) => {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Simulate payment processing time
    setTimeout(async () => {
        // 90% success rate simulation 
        // In a real app, this would call Stripe/PayPal API
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
            try {
                // Upgrade user in database
                const updateResult = await pool.query(
                    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
                    ['premium', userId]
                );

                if (updateResult.rows.length > 0) {
                    const updatedUser = updateResult.rows[0];

                    // Generate new token with updated role
                    const newToken = jwt.sign({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }, JWT_SECRET);

                    res.json({
                        success: true,
                        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
                        message: 'Payment processed and account upgraded',
                        user: updatedUser,
                        newToken: newToken // Client should update token
                    });
                } else {
                    res.status(404).json({ success: false, error: 'User not found' });
                }
            } catch (err) {
                console.error('Database update error:', err);
                res.status(500).json({ success: false, error: 'Payment succeeded but account upgrade failed' });
            }
        } else {
            res.status(400).json({ success: false, error: 'Card declined' });
        }
    }, 1500);
});

module.exports = router;
