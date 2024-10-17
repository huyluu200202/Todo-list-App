const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'http://localhost:4001/uploads/default-avatar.jpg' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
