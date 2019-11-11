const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
module.exports = function(app){
    app.get("/detailproduct",(req,res)=>{
        res.render("chitietsanpham");
    });
    app.post("/getDetailProduct",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        Product.findOne({_id:idproduct},function(err,data){
            if (err) {
                throw err;
            } else {
                res.send(data);
            }
        })
    });
    app.post("/getProductRelate",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        Product.findOne({_id:idproduct},function(err,product){
            if (err) {
                throw err;
            } else {
                ProductCategory.findOne({_id:product.category},function(err,category){
                    if (err){
                        throw err;
                    } else {
                        var arrresult = [];
                        category.listProduct.forEach(pro => {
                            Product.findOne({_id:pro._id},function(err,data){
                                if (err) {
                                    throw err;
                                } else {
                                    arrresult.push(data);
                                    if (category.listProduct.length == arrresult.length){
                                        res.send(arrresult);
                                    }
                                }
                            })
                        });
                    }
                })
            }
        })
    })
}