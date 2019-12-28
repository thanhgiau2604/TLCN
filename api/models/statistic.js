const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StatisticSchema = new Schema({
    day:String,
    viewproduct:[{id:Schema.Types.ObjectId, count: Number}],
    orderproduct: [{id:Schema.Types.ObjectId, count: Number}],
    page: Number
});
module.exports = mongoose.model('Statistic',StatisticSchema);


