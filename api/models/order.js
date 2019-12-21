const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    email: String,
    time: String,
    timestamp: Number,
    address : {
        fullname: String,
        phonenumber: String,
        province: String,
        district: String,
        commune: String,
        apartmentnumber: String
    },
    sumproductcost: Number,
    sumshipcost: Number,
    listproduct: [{name: String, quanty: Number, color: String, size: Number, cost:Number}],
    status: String,
    code: Number
});

module.exports = mongoose.model('order',OrderSchema);