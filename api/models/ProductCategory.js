const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
    name: String,
    quanty: Number,
    description: String,
    listProduct: [{_id:Schema.Types.ObjectId}]
});
module.exports = mongoose.model('productcategory',ProductCategorySchema);