const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Product = require("../models/Product");
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
function getCurrentDayTime() {
    offset = "+7";
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var day = new Date(utc + (3600000*offset));
    var nowday = day.getDate().toString()+"-"+(day.getMonth()+1).toString()+"-"+day.getFullYear().toString()+" "
    +day.getHours().toString()+":"+day.getMinutes().toString();
    return nowday;
  }
module.exports = function(app){
    app.get("/getAllProducts",(req,res)=>{
        Product.find({},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    });


    var nameImage;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "./public/img/product"),
        filename: (req, file, cb) => {
            nameImage = Date.now() + file.originalname;
            console.log(nameImage);
            cb(null, nameImage);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })

    const storageImageCategory = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "./public/img/banner"),
        filename: (req, file, cb) => {
            nameImage = Date.now() + file.originalname;
            cb(null, nameImage);
        }
    });

    const uploadImageCategory = multer({
        storage: storageImageCategory,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })

    const storageImageComment = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "./public/img/comments"),
        filename: (req, file, cb) => {
            nameImage = Date.now() + file.originalname;
            cb(null, nameImage);
        }
    });

    const uploadImageComment = multer({
        storage: storageImageComment,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })

    app.post("/uploadImageComment",uploadImageComment.single("imageData"),(req, res, next) => {
        res.send(nameImage);
    });
    app.post("/upload", upload.single("imageData"), (req, res, next) => {
        res.send(nameImage);
    });

    app.post("/uploadImageCategory",uploadImageCategory.single("imageData"),(req,res,next) => {
        res.send(nameImage);
    })
    app.post("/addNewProduct",parser,(req,res)=>{
        var product = new Product(JSON.parse(req.body.product));
        product.save(function(err,data){
            if (err){
                throw err;
            } else {
                getProducts(res);
            }
        })
    });

    app.post("/deleteImage",parser,(req,res)=>{
        const path = req.body.path;
        const deletePath = "./public/"+path;
        if (path!="/img/product/default.png"){
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

    app.post("/updateProduct",parser,(req,res)=>{
        const id = req.body.id;
        const name = req.body.name;
        const cost = req.body.cost;
        const oldcost = req.body.oldcost;
        const description =req.body.description;
        const sizes = JSON.parse(req.body.sizes);
        const image = JSON.parse(req.body.image);
        const quanty = parseInt(req.body.quanty);
        console.log("quanty="+quanty)
        var newcosts = new Array();
        newcosts = JSON.parse(oldcost);
        if (cost!=newcosts[newcosts.length-1].cost)
        {
            newcosts.push({cost:cost});
        }
        Product.update({_id:id},{$set:{name:name, quanty:quanty,costs:newcosts,description:description,image:image,
        sizes:sizes}},function(err,data){
            if (err){
                throw err;
            } else {
                getProducts(res);
            }
        })
    })
    app.post("/deleteProduct",parser,(req,res)=>{
        const id = req.body.id;
        Product.update({_id:id},{$set:{isDeleted:1}},function(err,data){
            if (err){
                throw err;
            } else 
            {
                getProducts(res);
            }
        })
    });

    //restore the product deleted by admin
    app.post("/restoreProduct",parser,(req,res)=>{
        const id = req.body.id;
        Product.update({_id:id},{$set:{isDeleted:0}},function(err,data){
            if (err){
                throw err;
            } else 
            {
                getProducts(res);
            }
        })
    });
    //search product
    app.post("/searchproduct",parser,(req,res)=>{
        const keysearch = req.body.keysearch;
        Product.find({name: {$regex : ".*"+keysearch+".*",'$options' : 'i' }},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    });

    //reponse comment
    app.post("/addResponse",parser,(req,res)=>{
        const idProduct = req.body.idProduct;
        const idComment = req.body.idComment;
        const content = req.body.content;
        const id = parseInt(Date.now().toString());
        const arrImage = [];
        var constImage = "/img/product/default.png";
        if (req.body.image1!=constImage) arrImage.push({image: req.body.image1});
        if (req.body.image2!=constImage) arrImage.push({image: req.body.image2});
        if (req.body.image3!=constImage)arrImage.push({image: req.body.image3});
        const singleComment = {
            id:id,
            content:content,
            date: getCurrentDayTime(),
            images: arrImage
        }
        Product.findOneAndUpdate({_id:idProduct,"comments._id":idComment},
            {"$push":{"comments.$.responses":singleComment}},{new:true},(err,data)=>{
            res.json(data.comments.sort((a,b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0)));
        })
    })
}