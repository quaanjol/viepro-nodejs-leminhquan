const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_mail: String,
    user_full: String,
    user_pass: String,
    user_level: Number
})

mongoose.model('User', userSchema, 'users');