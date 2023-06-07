const mongoose = require("mongoose");

fileSchema = new mongoose.Schema({
    file_name: {
        type: String,
        default: null,
        required: true
    },
    file_path: {
        type: String,
        default: null,
        required: true
    }
})

const publicationSchema = new mongoose.Schema({
    publication_id: {
        type: String,
        default: null,
        required: true
    },
    user_id: {
        type: String,
        default: null,
        required: true
    },
    email: {
        type: String,
        default: null,
        required: true
    },
    title: {
        type: String,
        default: null,
        required: true
    },
    author: {
        type: String,
        default: null,
        required: true
    },
    co_authors: {
        type: [String],
        default: null,
        required: false
    },
    published_date: {
        type: String,
        default: null,
        required: false
    },
    description: {
        type: String,
        default: null,
    },
    file: {
        type: String,
        default: null,
        required: false
    },

})

module.exports = mongoose.model("publication", publicationSchema);