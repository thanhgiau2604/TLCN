const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
const ObjectId = require('mongodb').ObjectId;
const Order = require("../models/order");
const Contact = require("../models/contact");
function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    nowday = day.toString()+month.toString()+year.toString();
    return nowday;
}
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
                     res.json(arrSale.splice(0,4));
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
        User.findOne({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                var arrProduct=[];
                var loop = async (_) => {
                  for (var i = 0; i < data.favoritelist.length; i++) {
                    var product = data.favoritelist[i];
                    var single = await Product.findOne({_id:product.id},(err,data)=>{
                    })
                    if (single){
                        arrProduct.push(single);
                    }
                  }
                  res.send(arrProduct.reverse());
                };
                if (data) loop();
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
                var arrProduct=[];
                var loop = async (_) => {
                  for (var i = 0; i < data.favoritelist.length; i++) {
                    var product = data.favoritelist[i];
                    var single = await Product.findOne({_id:product.id},(err,data)=>{
                    })
                    if (single){
                        arrProduct.push(single);
                    }
                  }
                  res.send(arrProduct.reverse());
                };
                if (data) loop();
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
        Order.find({email:email}).sort({timestamp:"descending"}).exec(function(err,data){
            if (err){
                throw err;
            } else {
                var arrResult=[];
                data.forEach(order => {
                    order.listproduct.forEach(product => {
                        var pro = {
                            product: product,
                            time: order.time,
                            status: order.status,
                            idOrder: order._id,
                            payment: order.payment || false
                        }
                        arrResult.push(pro);
                    });
                });
                res.send(arrResult);
            }
        })
    });
    app.post("/cancelOrder",parser,(req,res)=>{
        const idProduct = req.body.idProduct;
        const idOrder = req.body.idOrder;
        const email = req.body.email;
        Order.findOneAndUpdate({_id:idOrder,"listproduct._id":idProduct},
        {$set:{"listproduct.$.status":"canceled"}},{new:true},function(err,data){
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
                                status: order.status,
                                idOrder: order._id
                            }
                            arrResult.push(pro);
                        });
                    });
                    console.log(arrResult);
                    res.send(arrResult);
                }
            })
        })
    })
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
    app.post("/sendInfor",parser,(req,res)=>{
        var infor = {
            day:getCurrentDay(),
            name:  req.body.name,
            email: req.body.email,
            title: req.body.title,
            content: req.body.content
        }
        var singleContact = new Contact(infor);
        singleContact.save(function(err,data){
            if (err){
                res.json({success:0,err:err})
            } else {
                res.json({success:1})
            }
        })
    })
    app.post("/getProductRecommend",parser,(req,res)=>{
        let email = req.body.email;
        var i =0;
        var arrResult=[];
        if (email){
        User.findOne({email:email},{topCategory:1,_id:0},function(err,data){
            if (err){
                console.log(err);
            } else {
                if (!data) return res.json({data:[]});
                var topCategory = data.topCategory;
                var length = topCategory.length,arrSize=[];
                if (topCategory.length>3) length = 3;
                if (length ==1) arrSize[0] = 8; else arrSize[0] = 4;
                if (length ==2 ) arrSize[1] = 4; else arrSize[1] = 2;
                arrSize[2] = 2;
                topCategory.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));
                console.log("length="+length);
                var loop = async _ => {
                  for (i = 0; i < length; ++i) {
                       var arr  = await Product.aggregate([
                        {$match: {$and: [{category:topCategory[i].id},{quanty:{$gt:0}}]}},
                        {$sample: {size:arrSize[i]}}],function(err,data){
                            if (err){
                                console.log(err);
                            } else {
                            }
                        })
                        Array.prototype.push.apply(arrResult,arr);
                        if (i==length-1) return res.json({data:arrResult});
                  }
                };
                loop();
            }
        }) } else {
            res.json({data:[]})
        }
    })
    app.post("/updateTopCategory",parser,(req,res)=>{
        let idProduct = req.body.idProduct;
        let email = req.body.email;
        //console.log(email);
        Product.findOne({_id:idProduct},function(err,product){
            if (err) console.log(err);
            else {
                var category = product.category;
                //console.log(category);
                User.findOne({email:email},function(err,user){
                    var topCategory = user.topCategory;
                    var index = topCategory.findIndex(item => item.id.toString() == category.toString());
                    //console.log(index);
                    if (index==-1){
                        User.findOneAndUpdate({email:email},{"$push":{topCategory:{id:category,count:1}}},{new:true},function(err,data){
                            if (err) console.log(err); else console.log(data);
                        });
                    } else {
                        User.findOneAndUpdate(
                          { email: email },
                          { $inc: { "topCategory.$[filter].count": 1 } },
                          { arrayFilters: [{ "filter.id": category }] },
                          function (err, data) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log(data);
                            }
                          }
                        );
                    }
                })
            }
        })
    })
    app.get("/checkSale",(req,res) => {
        var today = new Date().getTime();
        const standard1 = 7776000000;
        const standard2 = 9936000000; 
        Product.find({$and:[{status:"normal"},{orders:{$lt:3}}]},(err,data)=>{
            if (err) console.log(err);
            else {
              var discount1 = async (_) => {
                for (var i = 0; i < data.length; i++) {
                  var product = data[i];
                  var currentCost = product.costs[product.costs.length - 1].cost;
                  var discount = currentCost - Math.floor(currentCost * 0.15);
                  if (today - product.createat >= standard1) {
                    await Product.update({_id:product._id },{$push:{costs:{cost:discount}},$set:{status: 'sale1'}});
                    await ProductCategory.findOneAndUpdate({name:"Sale Product"},{$pull:{listProduct:{_id:product._id}}})
                    await ProductCategory.findOneAndUpdate({name:"Sale Product"},{$push:{listProduct:{_id:product._id}}})
                  }
                }
              };
              discount1();
            }
        })
        Product.find({$and:[{status:"sale1"},{orders:{$lt:10}}]},(err,data)=>{
            if (err) console.log(err);
            else {
                var discount2 = async (_) => {
                    for (var i = 0; i < data.length; i++) {
                      var product = data[i];
                      var currentCost = product.costs[product.costs.length - 1].cost;
                      var discount = currentCost - Math.floor(currentCost * 0.25);
                      if (today - product.createat >= standard2) {
                          console.log("vô standard 2");
                        await Product.update({ _id: product._id},{$push: { costs:{cost: discount}},$set:{status: 'sale2'}},(err,data)=>{});
                        await ProductCategory.findOneAndUpdate({name:"Sale Product"},{$pull:{listProduct:{_id:product._id}}},(err,data)=>{})
                        await ProductCategory.findOneAndUpdate({name:"Sale Product"},{$push:{listProduct:{_id:product._id}}},(err,data)=>{})
                      }
                    }
                };
                discount2();
            }
        })
    });
    //San pham dc tao tu ngay
    console.log(new Date("Mar 14 2020").getTime());
    //console.log(new Date("Apr 10 2020").getTime());
    console.log(new Date().getTime()-1584118800000);
}