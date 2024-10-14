const express = require('express');
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');

const router = express.Router();
const SECRET_KEY = 'my_secret'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = user.id; 
        next();
    });
}

// Get all items for a user
router.get('/items', authenticateToken, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

// Create a new item for a user
router.post('/items', authenticateToken, async (req, res) => {
    const { name } = req.body; 

    if (!name) {
        return res.status(400).json({ message: 'Item name is required' });
    }

    const item = new Item({
        name,
        completed: false,
        userId: req.userId 
    });

    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
});

// Update an item
router.put('/items/:id', authenticateToken, async (req, res) => {
    const { name, completed } = req.body;

    try {
        const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: 'Item not found' }); 

        if (name !== undefined) item.name = name;
        if (completed !== undefined) item.completed = completed;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
});

// Delete an item
router.delete('/items/:id', authenticateToken, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: 'Item not found' }); 
        res.json({ message: 'Item deleted' }); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

module.exports = router;
