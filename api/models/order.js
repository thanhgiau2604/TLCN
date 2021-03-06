const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    email: String,
    time: String,
    timestamp: Number,
    fullname: String,
    phonenumber: String,
    address : String,
    sumproductcost: Number,
    sumshipcost: Number,
    listproduct: [{id:Schema.Types.ObjectId,name: String, image:String,quanty: Number, color: String, size: Number, cost:Number, status:String}],
    status: String,
    code: Number,
    payment: Boolean,
    costVoucher: Number,
    paymentMethod: String,
    paypalSale: {idSale:String, amount: Number},
    stripeChargeId: String
});

module.exports = mongoose.model('order',OrderSchema);