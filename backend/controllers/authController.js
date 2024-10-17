const multer = require('multer');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword }); 
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error); 
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userId: user._id, avatar: user.avatar }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload avatar 
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

// Change password
router.post('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const isNewPasswordMatch = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: error.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'luutuanhuy20022002@gmail.com',
                pass: 'hmoaejabrjgcwrpv',
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'luutuanhuy20022002@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://localhost:3000/reset-password/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset email sent!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpires = undefined; 
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
