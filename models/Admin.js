const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    admin_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
})