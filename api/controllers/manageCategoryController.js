const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Product = require("../models/Product");
const Category = require("../models/ProductCategory");
const ObjectId = require('mongodb').ObjectId;
const multer = require("multer");
const fs = require("fs");
function getProducts(res) {
    Product.find(function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({success:1,lProduct:data});
        }
    })
}
function getCategory(res) {
    Category.find(function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data);
        }
    })
}
module.exports = function(app){
    app.get("/manageCategory",(req,res)=>{
        res.render("quanlydanhmuc");
    });
    app.get("/getAllCategory",(req,res)=>{
        getCategory(res);
    });
    app.post("/getProductCategory",parser,(req,res)=>{
        var category = req.body.category;
        console.log(category);
        Category.findOne({_id:category},function(err,data){
            if (err){
                throw err;
            } else {
                var arrResult=[];
                data.listProduct.forEach(product => {
                    Product.findOne({_id:product._id},function(err,da){
                        if (err){
                            throw err;
                        } else {
                            arrResult.push(da);
                            if (data.listProduct.length == arrResult.length){
                                console.log(arrResult)
                                var result = {
                                    name: data.name,
                                    quanty: data.quanty,
                                    description: data.description,
                                    listProduct: arrResult,
                                    image:data.image
                                };
                                res.send(result);
                            }
                        }
                    })
                });
            }
        })
    });

    app.post("/deleteCategory",parser,(req,res)=>{
        const id = req.body.id;
        Category.remove({_id:id},function(err,data){
            if (err){
                throw err;
            } else {
                getCategory(res);
            }
        })
    });

    app.post("/deleteImageCategory",parser,(req,res)=>{
        const path = req.body.path;
        const deletePath = "./public/"+path;
        if (path!="/img/banner/defaultCategory.jpg"){
            fs.unlink(deletePath,(err)=>{
                if (err){
                    console.log(err);
                    res.json(0); 
                } else {
                    res.json(1);
                }
            })
        } else {
            res.json(1);
        }
    })

    app.post("/addNewCategory",parser,(req,res)=>{
        var category = new Category(JSON.parse(req.body.category));
        category.save(function(err,data){
            if (err){
                throw err;
            } else {
                getCategory(res);
            }
        })
    });
    app.post("/updateCategory",parser,(req,res)=>{
        const cat = JSON.parse(req.body.category);
        const id = cat.id;
        const name = cat.name;
        const quanty = cat.quanty;
        const description = cat.description;
        const listProduct = cat.listProduct;
        const image = cat.image;
        for (var i=0; i<listProduct.length; i++){
            let pro = listProduct[i];
            Product.findOneAndUpdate({_id:pro._id},{$set:{category:id}},(err,data)=>{
                if (err) console.log(err);
            });
        }
        Category.update({_id:id},{$set:{name:name,quanty:quanty,description:description,
        listProduct:listProduct, image:image}},function(err,data){
            if (err){
                throw err;
            } else {
                getCategory(res);
            }
        })
    });
    //search category
    app.post("/searchcategory",parser,(req,res)=>{
        const keysearch = req.body.keysearch;
        Category.find({name: {$regex : ".*"+keysearch+".*",'$options' : 'i' }},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    })
}