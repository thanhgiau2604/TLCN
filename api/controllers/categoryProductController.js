const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
module.exports = function(app){
    app.get("/categoryproduct",(req,res)=>{
        res.render("danhmucsanpham");
    });
}