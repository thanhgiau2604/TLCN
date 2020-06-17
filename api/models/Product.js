const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    quanty: Number,
    costs: [{cost:Number}],
    image: {image1:String, image2:String, image3:String},
    description: String,
    sizes: [{
        size: Number,
        colors: [{
            color: String,
            quanty: Number
        }]
    }],
    ratings: [
        {user: String,value:Number,date:String}
    ],
    comments: [{
        id: Number,
        username: String,
        content: String,
        date: String,
        images: [{image:String}],
        responses: [{id:Number,content: String, date:String, images:[{image:String}]}]
    }],
    category: [{id:Schema.Types.ObjectId}],
    createat: Number,
    views: Number,
    orders: Number,
    status: String,
    isDeleted: Number
});

module.exports = mongoose.model('products',ProductSchema);