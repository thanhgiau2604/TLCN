const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
const ObjectId = require('mongodb').ObjectId;
const Order = require("../models/order");
module.exports = function(app,apiRouter){
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
        ProductCategory.find({name:"Sale Product"},function(err,data){
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
                var count = 0;
                data[0].favoritelist.forEach(pro => {
                    Product.findOne({"_id":pro.id},function(err,da){
                        count++;
                        if (err){
                            throw err;
                        } else {
                            if (da){
                                arrProduct.push(da);
                                if (count==data[0].favoritelist.length){
                                    res.send(arrProduct);
                                }
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
            if (data){
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
                var count = 0;
                data[0].historylist.forEach(pro => {
                    Product.findOne({"_id":pro.id},function(err,da){
                        count++;
                        if (err){
                            throw err;
                        } else {
                            if (da){
                                arrProduct.push(da);
                                if (count == data[0].historylist.length) {
                                    res.send(arrProduct);
                                }
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
        Order.find({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                var arrResult=[];
                data.forEach(order => {
                    order.listproduct.forEach(product => {
                        var pro = {
                            product: product,
                            time: order.time,
                            status: order.status
                        }
                        arrResult.push(pro);
                    });
                });
                res.send(arrResult);
            }
        })
    });

    app.get("/getSneaker",(req,res)=>{
        ProductCategory.find({name:"Sneaker Product"},function(err,data){
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
        ProductCategory.find({name:"Sport Product"},function(err,data){
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
        ProductCategory.find({name:"Pump Product"},function(err,data){
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
        ProductCategory.find({name:"Kid Product"},function(err,data){
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

    //handle Search
    app.get("/search",(req,res)=>{
        res.render("timkiemsanpham");
    });

    app.post("/itemSearch",parser,(req,res)=>{
        const keysearch = req.body.keysearch;
        Product.find({name: {$regex : ".*"+keysearch+".*",'$options' : 'i' }},function(err,data){
            if (err){
                throw err;
            } else {
                if (data.length==0){
                    Product.find({$text:{$search:keysearch}},function(err,data){
                        if (err){
                            throw err;
                        } else {
                            res.send(data);
                        }
                    })
                } else {
                    res.send(data);
                }
            }
        })
    });

    app.get("/contact",(req,res)=>{
        res.render("lienhe");
    })
}