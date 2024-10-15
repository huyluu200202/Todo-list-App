const multer = require('multer');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = 'my_secret';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword }); 
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error); 
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userId: user._id, avatar: user.avatar }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is missing!' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }

    try {
        const avatarUrl = `http://localhost:4001/${req.file.path.replace(/\\/g, '/')}`; 
        const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ avatar: avatarUrl });
    } catch (error) {
        console.error('Error during avatar upload:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
