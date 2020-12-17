const mongoose = require('mongoose');

// Creating the user schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

let User = module.exports = mongoose.model('User', UserSchema);