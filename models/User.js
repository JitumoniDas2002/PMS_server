const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: null,
        required: true
    },
    first_name: { 
        type: String, 
        default: null 
    },
    last_name: { 
        type: String, 
        default: null 
    },
    username: {
        type: String,
        default: null,
        unique: true
    },
    email: { 
        type: String, 
        unique: true 
    },
    password: { 
        type: String 
    },
    token: { 
        type: String 
    },
    publications: {
        type: [String],
        default: null,
        required: false
    }
});

module.exports = mongoose.model("user", userSchema);