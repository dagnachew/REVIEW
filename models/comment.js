var mongoose = require("mongoose");

//SCHEMA SETUP
var CommentSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comment", CommentSchema);
