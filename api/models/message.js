const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    index: String,
    content: String,
    datetime: String,
    sender: String
});

module.exports = mongoose.model('message',MessageSchema);