const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    sender: String,
    receiver: String,
    content: String,
    timestamp: Number,
    type: String,
    day: String,
    seen: Boolean
});

module.exports = mongoose.model('chat',ChatSchema);