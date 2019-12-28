const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Product = require("../models/Product");
const ObjectId = require('mongodb').ObjectId;
const multer = require("multer");

function getProducts(res) {
    Product.find(function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({success:1,lProduct:data});
        }
    })
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

    app.post("/updateProduct",parser,(req,res)=>{
        const id = req.body.id;
        const name = req.body.name;
        const cost = req.body.cost;
        const oldcost = req.body.oldcost;
        const description =req.body.description;
        const sizes = JSON.parse(req.body.sizes);
        const image = JSON.parse(req.body.image);
        var newcosts = new Array();
        newcosts = JSON.parse(oldcost);
        if (cost!=newcosts[newcosts.length-1].cost)
        {
            newcosts.push({cost:cost});
        }
        Product.update({_id:id},{$set:{name:name,costs:newcosts,description:description,image:image,
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
        Product.remove({_id:id},function(err,data){
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
    })
}