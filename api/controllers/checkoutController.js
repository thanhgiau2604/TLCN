const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");
const ObjectId = require('mongodb').ObjectId;
const message = require("../models/message");
const express = require("express");
const Order = require("../models/order");
const sendmail = require("./mail");
const jwt = require("jsonwebtoken");
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
module.exports = function(app,apiRouter){
    apiRouter.get("/checkout",(req,res)=>{
        res.render("checkout");
    })

    app.post("/saveOrder",parser,(req,res)=>{
        const order = JSON.parse(req.body.order);
        Order.create(order,function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data._id);
            }
        })
    });
    app.post("/updateAddress",parser,(req,res)=>{
        const address = JSON.parse(req.body.address);
        const id = req.body.id;
        console.log(address);
        console.log(id);
        Order.update({_id:id},{$set:{address:address}},function(err,data){
            if (err){
                throw err;
            } else {
                Order.findOne({_id:id},function(err,data){
                    if (err){
                        throw err;
                    } else {
                        res.send(data);
                    }
                })
            }
        });
    });

    app.post("/sendmail",parser,(req,res) => {
        const order = JSON.parse(req.body.order);
        const id = req.body.id;
        let txtTo = order.email;
        let txtSubject = "XÁC NHẬN ĐƠN HÀNG TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
        let dssp ="";
        order.listproduct.forEach(e => {
            var strsp = `Name: ${e.name}; Quanty: ${e.quanty}; color:${e.color}; size: ${e.size}; cost: ${e.cost}`;
            dssp = dssp + strsp+"\n";
        });
        let donhang = 
        "Don hang cua ban:"+order.address.fullname+"-"+order.address.phonenumber+"\n"+
        `Tong tien san pham: ${order.sumproductcost}đ;\n`+
        `Tong phi ship:${order.sumshipcost};\n`+
        `Danh sach san pham:\n`;
        let diachi =`DIA CHI NHAN HANG: ${order.address.apartmentnumber}-${order.address.commune}-${order.address.district}-${order.address.province}`
        let numberRandom = randomInt(100000,999999);
        let linkXacNhan = "\nlink xác nhận: http://localhost:3000/checkout/"+txtTo+"/"+numberRandom;
        //Luu vao databse;
        Order.update({_id:id},{$set:{code:numberRandom}},function(err,data){
            let txtContent = donhang+dssp+diachi+linkXacNhan;
            sendmail(txtTo,txtSubject,txtContent);
            res.send("Gửi thành công!");
        });
    });

    app.get("/checkout/:email/:code",(req,res)=>{
        Order.update({email:req.params.email,code:req.params.code},{$set:{status:"confirmed"}},function(err,data){
            if (err){
                throw err;
            } else {
                let txtTo = req.params.email;
                let txtSubject = "THÔNG BÁO TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
                let txtContent = "Bạn đã xác nhận đơn hàng thành công với mã đơn hàng: " +req.params.code;
                sendmail(txtTo,txtSubject,txtContent);
                User.update({email:req.params.email},{$set:{cart:[]}},function(err,data){
                    if (err){
                        throw err;
                    } else {
                        res.redirect("/");
                    }
                })
            }
        });
    })
}