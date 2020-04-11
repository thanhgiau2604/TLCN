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
    votes: {
        vote1: Number,
        vote2: Number,
        vote3: Number,
        vote4:Number,
        vote5: Number
    },
    comments: [{
        id: Number,
        username: String,
        content: String,
        date: String,
        images: [{image:String}]
    }],
    category: Schema.Types.ObjectId,
    createat: Number,
    views: Number
});

module.exports = mongoose.model('products',ProductSchema);