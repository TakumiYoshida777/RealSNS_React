const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 200,
    },
    img: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: [],
    },
    bookmarks: {
        type: Array,
        default: [],
    },


    comment: {
        type: Array,
        default: [],
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);