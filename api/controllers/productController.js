const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
const Statistic = require("../models/statistic");
function getCart(data,res){
    var arr = [];
    if (data.cart.length==0) {
        res.send(arr);
        return;
    }
    data.cart.forEach(pro => {
        Product.findOne({ _id: pro.idProduct }, function (err, da) {
            if (err) {
                throw err;
            } else {
                var newProduct = {
                    product: da,
                    quanty: pro.quanty,
                    size: pro.size,
                    color: pro.color,
                    status: pro.status
                }
                arr.push(newProduct);
                if (arr.length == data.cart.length) {
                    res.send(arr);
                }
            }
        })
    });
}
function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    if (day%10==day) day = '0' + day.toString();
    if (month%10==month) month = '0'+month.toString();
    nowday = year.toString()+month.toString()+day.toString();
    return nowday;
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
    app.get("/detailproduct",(req,res)=>{
        res.render("chitietsanpham");
    });
    app.post("/getDetailProduct",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        console.log(idproduct);
        if (!idproduct) {
            res.send("");
        } else {
            Product.findOne({ _id: idproduct }, function (err, data) {
                if (err) {
                    throw err;
                } else {
                    res.send(data);
                }
            })
        }
    });
    app.post("/getProductRelate",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        if (idproduct){
            Product.findOne({_id:idproduct},function(err,singleProduct){
                if (err) {
                    throw err;
                } else {
                    if (!singleProduct.category){
                        res.send([]);
                    } else {
                        var arrResult = [];
                        var loop = async (_) => {
                          for (var i = 0; i < singleProduct.category.length; i++) {
                            var category = await ProductCategory.findOne({_id: singleProduct.category[i].id },function (err, category) {});
                            if (category) {
                                for (var j=0; j<category.listProduct.length; j++) {
                                  var pro = category.listProduct[j];
                                  var index = arrResult.findIndex((item) => item._id == pro._id);
                                  if (index == -1) {
                                    var product = await Product.findOne({ _id: pro._id },function (err, product) {});
                                    if (product) arrResult.push(product);
                                  }
                                }
                            }
                          }
                          res.send(arrResult.splice(0,8));
                        };
                        loop();
                    }
                }
            })
        }
    });
    app.post("/updateProductHistory",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        const email = req.body.email;
        if (idproduct){
            User.findOneAndUpdate({email:email},{'$pull':{historylist:{id:idproduct}}},{new:true},function(err,data){
                if (err){
                    throw err;
                } else {
                    var time = parseInt(Date.now().toString());
                    User.findOneAndUpdate({email:email},{'$push':{historylist:{$each:[{id:idproduct,time:time}],
                $sort:{time:-1}}}},{new:true},function(err,data){
                        if (err){
                            throw err;
                        } else {
                           
                            // console.log(data);
                            var arrResult=[];
                            var count  = 0;
                            const forLoop = async _ => {
                                for (var i = 0; i < data.historylist.length; i++) {
                                    // console.log(data.historylist[i]);
                                    await Product.findOne({ _id: data.historylist[i].id }, function (err, da) {
                                        count++;
                                        if (da){
                                            arrResult.push(da);
                                            if (count== data.historylist.length) {
                                                res.send(arrResult);
                                            }
                                        }
                                    })
                                }
                            }
                            forLoop();
                        }
                    })
                }
            })
        }
    })
    app.post("/cart",parser,(req,res)=>{
        const email = req.body.email;
        User.findOne({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                getCart(data,res);
            }
        })
    });
    app.post("/addToCart",parser,(req,res)=>{
        const id = req.body.id;
        const email = req.body.email;
        var quantyProduct = req.body.quanty;
        var color = req.body.color;
        var size = req.body.size;
        if (!color) color="default"
        if (!size) size = 0;
        if (!quantyProduct) quantyProduct=1;
        quantyProduct = parseInt(quantyProduct);
        User.findOne({email:email},function(err,user){
            if (err){
                throw err;
            } else {
                if (user){
                    var bool = false,quanty;
                for (var i=0; i<user.cart.length; i++){
                    if (user.cart[i].idProduct==id){
                        quanty = user.cart[i].quanty;
                        bool = true;
                        break;
                    }
                }
                if (bool==false){
                    User.findOneAndUpdate({email:email},{'$push':{cart:{idProduct:id,quanty:quantyProduct,size:size,color:color,status:"processing"}}},{new:true},function(err,data){
                        if (err){
                            throw err;
                        } else {
                            // console.log(data);
                            getCart(data,res);
                        }
                    })
                } else {
                    User.findOneAndUpdate({'email':email,"cart.idProduct":id},{'$set':{"cart.$.quanty":quanty+quantyProduct,"cart.$.size":size,"cart.$.color":color}},{new:true},function(err,data){
                        if (err){
                            throw err;
                        } else {
                            // console.log(data);
                            getCart(data,res);
                        }
                    })
                }
                }
            }
        })
    });
    app.post("/removeFromCart",parser,(req,res)=>{
        const id = req.body.id;
        const email = req.body.email;
        // console.log(id);
        User.findOneAndUpdate({email:email},{'$pull':{cart:{idProduct:id}}},{new:true},function(err,data){
            if (err){
                throw err;
            } else {
                getCart(data,res);
            }
        })
    });
    app.post("/addToFavorite",parser,(req,res)=>{
        const id = req.body.id;
        const email = req.body.email;
        User.findOneAndUpdate({email:email},{'$pull':{favoritelist:{id:id}}},{new:true},function(err,data){
            User.findOneAndUpdate({email:email},{'$push':{favoritelist:{id:id}}},{new:true},function(err,data){
                if (err){
                    throw err;
                } else {
                    res.json({success:1});
                }
            })
        })
    });

    app.post("/checkFavorite",parser,(req,res)=>{
        const idProduct = req.body.idProduct;
        const email = req.body.email;
        if (email&&idProduct){
            User.findOne({email:email},function(err,user){
                if (err){
                    throw err;
                } else {
                    var ok = false;
                    for (var i=0; i<user.favoritelist.length; i++){
                        if (idProduct==user.favoritelist[i].id){
                            ok=true;
                            res.json(1);
                            break;
                        }
                    }
                    if (ok==false) res.json(0);
                }
            })
        } else {
            res.json(0);
        }
    })

    app.post("/updateCountView",parser,(req,res)=>{
        const idProduct = req.body.idProduct;
        console.log(idProduct);
        if (idProduct) {
            var currentDay = getCurrentDay();
            console.log(currentDay);
            Product.findOneAndUpdate({_id:idProduct},{$inc:{views:1}},function(err,data){});
            Statistic.findOne({ day: currentDay }, function (err, data) {
                if (data) {
                    var listViewToday = data.viewproduct;
                    var result = [];
                    var ok = false;
                    for (var i = 0; i < listViewToday.length; i++) {
                        if (listViewToday[i].id.equals(idProduct)) {
                            ok = true;
                            var itemresult = {
                                id: idProduct,
                                count: listViewToday[i].count + 1
                            }
                            result.push(itemresult);
                        } else {
                            var itemresult = {
                                id: listViewToday[i].id,
                                count: listViewToday[i].count
                            }
                            result.push(itemresult);
                        }
                    }
                    if (ok == false) result.push({ id: idProduct, count: 1 });
                    Statistic.update({ day: currentDay }, { $set: { viewproduct: result } }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(data);     
                        }
                    });
                }
            })
        }  
    })

    app.post("/showComment",parser,(req,res)=>{
        const idProduct= req.body.idProduct;
        if (idProduct){
            Product.findOne({_id:idProduct},(err,data)=>{
                if (err){
                    throw err;
                } else {
                    var arr = data.comments;
                    arr.sort((a,b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0)); 
                    res.json(arr);
                }
            })
        }
    })
    app.post("/addComment",parser,(req,res)=>{
        const idProduct = req.body.idProduct;
        if (idProduct){
            const content = req.body.content;
        const id = parseInt(Date.now().toString());
        const userName = req.body.username;
        const arrImage = [];
        var constImage = "/img/product/default.png";
        if (req.body.image1!=constImage) arrImage.push({image: req.body.image1});
        if (req.body.image2!=constImage) arrImage.push({image: req.body.image2});
        if (req.body.image3!=constImage)arrImage.push({image: req.body.image3});
        const singleComment = {
            id:id,
            username:userName,
            content:content,
            date: getCurrentDayTime(),
            images: arrImage
        }
        Product.findOneAndUpdate({_id:idProduct},{"$push":{comments:singleComment}},{new:true},(err,data)=>{
            res.json(data.comments.sort((a,b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0)));
        })
        }    
    });
    app.post("/getRating",parser,(req,res)=>{
        const id = req.body.id;
        const email = req.body.email;
        if (id){
            Product.findOne({_id:id},function(err,data){
                if (err){
                    console.log(err);
                } else {
                    if (data){
                        var done = false;
                        var ratings = data.ratings;
                        var star1=0,star2=0,star3=0,star4=0,star5=0;
                        for(var i=0; i<ratings.length; i++) {
                            var rate = ratings[i];
                            if (rate.value==1) star1++; else
                            if (rate.value==2) star2++; else
                            if (rate.value==3) star3++; else
                            if (rate.value==4) star4++; else
                            if (rate.value==5) star5++;
                            if (rate.user==email) done=true;
                        };
                        var sum = star1+star2+star3+star4+star5;
                        var percent1,percent2,percent3,percent4,percent5;
                        if (sum==0) {
                            percent1=percent2=percent3=percent4=percent5=0;
                        } else {
                            percent1 = (star1*100)/sum;
                            percent2 = (star2*100)/sum;
                            percent3 = (star3*100)/sum;
                            percent4 = (star4*100)/sum;
                            percent5 = (star5*100)/sum;
                        }
                        var arrResult = [];
                        arrResult.push({value:star1,percent:percent1});
                        arrResult.push({value:star2,percent:percent2});
                        arrResult.push({value:star3,percent:percent3});
                        arrResult.push({value:star4,percent:percent4});
                        arrResult.push({value:star5,percent:percent5});
                        console.log(arrResult);
                        res.json({data: arrResult, done:done});
                    }
                }
            })
        }
    })
    app.post("/ratingStar",parser,(req,res)=>{
        const value = req.body.value;
        const id = req.body.id;
        const email = req.body.email;
        if (id&&email){
            singleRating = {
                user: email,
                value: value,
                date: getCurrentDayTime()
            }
            Product.findOneAndUpdate({_id:id},{"$push":{ratings:singleRating}},{new:true},(err,data) => {
                if (err){
                    res.send(data);
                } else {
                    res.send(data);
                }
            })
        }
    })
}