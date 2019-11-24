const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
const ObjectId = require('mongodb').ObjectId;
const message = require("../models/message");
module.exports = function(app){
    // var today = new Date();
    // var datetime = today.getDate()+"-"+(today.getMonth() + 1)+"-"+today.getFullYear() +" "
    // +today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();; 
    // var mess = {
    //     index: Date.now().toString(),
    //     content:"Giảm giá 30% ngày 6/11/2019 khi mua hàng trực tuyến trong khung giờ từ 17h-19h",
    //     datetime: datetime,
    //     sender: ObjectId("5dc1746095bff41c64fe4c51")
    // }
    // message.create(mess,function(err,data){
    //     console.log(data);
    // })

    app.get("/getPopular",(req,res)=>{
        Product.find({}).sort({views:"descending"}).exec(function(err,data){
            if (err){
                throw err;
            } else {
                res.json(data.slice(0,4));
            }
        })
    })
    app.get("/getNew",(req,res)=>{
        Product.find({}).sort({createat:"descending"}).exec(function(err,data){
            if (err){
                throw err;
            } else {
                res.json(data.slice(0,4));
            }
        })
    })
    app.get("/getSale",(req,res)=>{
        ProductCategory.find({name:"SaleProduct"},function(err,data){
            // res.json(data[0]);
             var arrSale = new Array();
             var count = data[0].listProduct.length;
             var index = 0;
             data[0].listProduct.forEach(p=> {
                 Product.findOne({_id:p._id},function(err,da){
                     index++;
                     arrSale.push(da);
                     if (index==count)
                     res.json(arrSale);
                 })
             });
         })
    });

    app.get("/listfavorite",(req,res)=>{
        res.render("sanphamyeuthich");
    });

    //get favorite list
    app.post("/productFavorite",parser,(req,res)=>{
        const email = req.body.email;
        User.find({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                var arrProduct=[];
                data[0].favoritelist.forEach(pro => {
                    Product.findOne({"_id":pro.id},function(err,da){
                        if (err){
                            throw err;
                        } else {
                            arrProduct.push(da);
                            if (arrProduct.length==data[0].favoritelist.length){
                                res.send(arrProduct);
                            }
                        }
                    });
                });
            }
        })
    });

    //handle delete product
    app.post("/deleteFav",parser,(req,res)=>{
        const idDel = req.body.idDel;
        const email = req.body.email;
        var arrResult=[];
        User.findOneAndUpdate({email:email},{'$pull':{favoritelist:{id:new ObjectId(idDel)}}},{new:true},function(err,data){
            data.favoritelist.forEach(pro => {
                Product.findOne({_id:pro.id},function(err,da){
                    if (err){
                        throw err;
                    } else {
                        arrResult.push(da);
                        if (arrResult.length==data.favoritelist.length){
                            res.send(arrResult);
                        }
                    }
                })
            }); 
            if (data.favoritelist.length==0){
                res.send([]);
            }
        })
    });

    ///order - history
    app.get("/orderhistory",(req,res)=>{
        res.render("lichsudonhang");
    });


    app.post("/productHistory",parser,(req,res)=>{
        const email = req.body.email;
        User.find({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                var arrProduct=[];
                data[0].historylist.forEach(pro => {
                    Product.findOne({"_id":pro.id},function(err,da){
                        if (err){
                            throw err;
                        } else {
                            arrProduct.push(da);
                            if (arrProduct.length==data[0].historylist.length){
                                res.send(arrProduct);
                            }
                        }
                    });
                });
            }
        })
    });

    app.post("/delHistory",parser,(req,res)=>{
        const email = req.body.email;
        var arrResult=[];
        User.update({email:email},{$set:{historylist:[]}},function(err,data){
            if (err){
                throw err;
            } else {
                res.send([]);
            }
        })
    });

    app.post("/getOrder",parser,(req,res)=>{
        const email = req.body.email;
        var arrResult=[];
        User.findOne({email:email},function(err,data){
            data.cart.forEach(e => {
                Product.findOne({_id:e.idProduct},function(err,da){
                    var cart = {
                        product: da,
                        quanty: e.quanty,
                        size: e.size,
                        color: e.color,
                        status: e.status
                    }
                    arrResult.push(cart);
                    if (arrResult.length == data.cart.length){
                        res.send(arrResult);
                    }
                })
            });
        })
    });

    app.get("/getSneaker",(req,res)=>{
        ProductCategory.find({name:"SneakerProduct"},function(err,data){
            // res.json(data[0]);
             var arr = new Array();
             var count = data[0].listProduct.length;
             var index = 0;
             data[0].listProduct.forEach(p=> {
                 Product.findOne({_id:p._id},function(err,da){
                     index++;
                     arr.push(da);
                     if (index==count)
                     res.json(arr);
                 })
             });
         })
    });

    app.get("/getSport",(req,res)=>{
        ProductCategory.find({name:"SportProduct"},function(err,data){
            // res.json(data[0]);
             var arr = new Array();
             var count = data[0].listProduct.length;
             var index = 0;
             data[0].listProduct.forEach(p=> {
                 Product.findOne({_id:p._id},function(err,da){
                     index++;
                     arr.push(da);
                     if (index==count)
                     res.json(arr);
                 })
             });
         })
    });

    app.get("/getPump",(req,res)=>{
        ProductCategory.find({name:"PumpProduct"},function(err,data){
            // res.json(data[0]);
             var arr = new Array();
             var count = data[0].listProduct.length;
             var index = 0;
             data[0].listProduct.forEach(p=> {
                 Product.findOne({_id:p._id},function(err,da){
                     index++;
                     arr.push(da);
                     if (index==count)
                     res.json(arr);
                 })
             });
         })
    });

    app.get("/getKid",(req,res)=>{
        ProductCategory.find({name:"KidProduct"},function(err,data){
            // res.json(data[0]);
             var arr = new Array();
             var count = data[0].listProduct.length;
             var index = 0;
             data[0].listProduct.forEach(p=> {
                 Product.findOne({_id:p._id},function(err,da){
                     index++;
                     arr.push(da);
                     if (index==count)
                     res.json(arr);
                 })
             });
         })
    });
}