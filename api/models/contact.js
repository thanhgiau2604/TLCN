const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    day:String,
    name: String,
    email:String,
    title: String,
    content:String
});
module.exports = mongoose.model('Contact',ContactSchema);


