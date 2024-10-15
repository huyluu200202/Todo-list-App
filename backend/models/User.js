const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'http://localhost:4001/uploads/default-avatar.jpg' },
});

module.exports = mongoose.model('User', userSchema);
