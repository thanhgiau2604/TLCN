const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
module.exports = function(app){
    app.get("/categoryProduct",(req,res)=>{
        res.render("danhmucsanpham");
    });

    app.get("/getCategoryProduct/:name",(req,res)=>{
        var name = req.params.name;
        console.log(name);
        ProductCategory.findOne({name:name},function(err,data){        
            if (err){
                throw err;
            } else {
                var arrResult=[];
                data.listProduct.forEach(product => {
                    Product.findOne({_id:product._id},function(err,pro){
                        if (err){
                            throw err;
                        } else {
                            arrResult.push(pro);
                            if (arrResult.length==data.listProduct.length){
                                res.send({lProduct:arrResult,category:data});
                            }
                        }
                    })
                });
            }
        })
    });
}