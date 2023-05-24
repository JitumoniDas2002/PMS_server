const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
    publication_id: {
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
        default: Date.now(),
        required: false
    },
    description: {
        type: String,
        default: null,
    }

})

module.exports = mongoose.model("publication", publicationSchema);