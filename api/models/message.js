const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    index: String,
    content: String,
    datetime: String,
    sender: Schema.Types.ObjectId
});

module.exports = mongoose.model('message',MessageSchema);