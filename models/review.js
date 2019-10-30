var mongoose = require("mongoose");

//SCHEMA SETUP
var reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Review", reviewSchema);
