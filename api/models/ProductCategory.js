const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
    name: String,
    displayName:String,
    quanty: Number,
    description: String,
    listProduct: [{_id:Schema.Types.ObjectId}],
    image:String
});
module.exports = mongoose.model('productcategory',ProductCategorySchema);