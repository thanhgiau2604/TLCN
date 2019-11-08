const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    quanty: Number,
    cost: Number,
    oldcost:Number,
    shipcost: Number,
    image: String,
    description: String,
    sizes: {
        size: Number,
        colors: [{
            color: String,
            quanty: Number
        }]
    },
    votes: {
        vote1: Number,
        vote2: Number,
        vote3: Number,
        vote4:Number,
        vote5: Number
    },
    comments: [{
        id: String,
        idUser: Schema.Types.ObjectId,
        content: String,
        date: Date
    }]
});

module.exports = mongoose.model('products',ProductSchema);