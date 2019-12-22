const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");

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

module.exports = function(app){
    app.get("/detailproduct",(req,res)=>{
        res.render("chitietsanpham");
    });
    app.post("/getDetailProduct",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        const email = req.body.email;
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
                if (!product.category){
                    res.send([]);
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
            }
        })
    });

    app.post("/updateProductHistory",parser,(req,res)=>{
        const idproduct = req.body.idproduct;
        const email = req.body.email;
        console.log(idproduct+" "+email);
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
                        const forLoop = async _ => {
                            for (var i = 0; i < data.historylist.length; i++) {
                                console.log(data.historylist[i]);
                                await Product.findOne({ _id: data.historylist[i].id }, function (err, da) {
                                    console.log(da);
                                    arrResult.push(da);
                                    if (arrResult.length == data.historylist.length) {
                                        res.send(arrResult);
                                    }
                                })
                            }
                        }
                        forLoop();
                    }
                })
            }
        })
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
                            console.log(data);
                            getCart(data,res);
                        }
                    })
                } else {
                    User.findOneAndUpdate({'email':email,"cart.idProduct":id},{'$set':{"cart.$.quanty":quanty+quantyProduct}},{new:true},function(err,data){
                        if (err){
                            throw err;
                        } else {
                            console.log(data);
                            getCart(data,res);
                        }
                    })
                }
            }
        })
    });
    app.post("/removeFromCart",parser,(req,res)=>{
        const id = req.body.id;
        const email = req.body.email;
        console.log(id);
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
    })
}