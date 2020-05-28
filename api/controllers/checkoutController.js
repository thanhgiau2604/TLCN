const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const Order = require("../models/order");
const Product = require("../models/Product");
const sendmail = require("./mail");
var Statistic = require("../models/statistic");
const NodeGeocoder = require('node-geocoder');
const distance = require('google-distance');
var _eQuatorialEarthRadius = 6378.1370;
var _d2r = (Math.PI / 180.0);
var arrUserOnline = []
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

 function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    if (month%10==month) month = '0'+month;
    if (day%10==day) day='0'+day;
    nowday = year.toString()+month.toString()+day.toString();
    return nowday;
}
module.exports = function(app,io){
    app.get("/checkout",(req,res)=>{
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
    app.post("/getPosition",parser,(req,res)=>{
        const address = req.body.address;
        const options = {
            provider: 'google',
            apiKey: 'AIzaSyAAe03FCWqKI0XJjwuuZQT41KpU9KOgBU4', 
            formatter: null 
          };
        const geocoder = NodeGeocoder(options);
        geocoder.geocode(address)
        .then(result => {
            console.log(result);
            if (result.length>0) res.json({err:"",position:{lat:result[0].latitude,lng: result[0].longitude}})
            else res.json({err:"Vui lòng kiểm tra lại địa chỉ!"});
        }, 
        err=> res.json({err:"Vui lòng kiểm tra lại địa chỉ!"}));
        
        // opencage.geocode({q: address}).then(data => {
        //     if (data.status.code == 200) {
        //       if (data.results.length > 0) {
        //         var place = data.results[0];
        //         res.json({err:"",position:place.geometry});
        //       } else {
        //           res.json({err:"Vui lòng kiểm tra lại địa chỉ!"})
        //       }
        //     } else{
        //       console.log('have a problem');
        //     } 
        //   }).catch(error => {
        //     console.log('error', error.message);
        //   });
    })
    app.post("/updateAddress",parser,(req,res)=>{
        const address = req.body.address;
        console.log(address);
        const fullname = req.body.fullname;
        const phonenumber = req.body.phonenumber;
        const email = req.body.email;
        const id = req.body.id;
        distance.apiKey = 'AIzaSyAAe03FCWqKI0XJjwuuZQT41KpU9KOgBU4';
        User.findOneAndUpdate({email:email},{address:address},function(err,data){
            if (err) console.log(err);
        })
        distance.get(
            {
              origin: 'Đại học Sư phạm kỹ thuật TPHCM',
              destination: address
            },
            function(err, data) {
              if (err){
                res.json({err:1})
              } else {
                  console.log(data);
                var result = 3*data.distanceValue;
                Order.update({ _id: id }, { $set: { address: address, fullname:fullname, phonenumber:phonenumber, sumshipcost:result} }, function (err, data) {
                    if (err) {
                        throw err;
                    } else {
                        Order.findOne({ _id: id }, function (err, data) {
                            if (err) {
                                throw err;
                            } else {
                                res.json({err:0,data:data,ship:result});
                            }
                        })
                    }
                });
              }
          });
    });
    app.post("/sendmail",parser,(req,res) => {
        const order = JSON.parse(req.body.order);
        const ship = req.body.ship;
        const id = req.body.id;
        let txtTo = order.email;
        let txtSubject = "XÁC NHẬN ĐƠN HÀNG TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
        let dssp ="";
        var count = 0;
        order.listproduct.forEach(e => {
            count++;
            if (e.size==0) e.size='default';
            var strsp = `<p>${count}. Tên sản phẩm: ${e.name}; Số lượng: ${e.quanty}; Màu sắc:${e.color}; Size: ${e.size}; Giá sản phẩm: ${e.cost}đ</p>`;
            dssp = dssp + strsp;
        });
        let donhang = 
        "<h3>Đơn hàng của anh/chị: "+order.fullname+"- SDT:"+order.phonenumber+"</h3>"+
        `<h3>Tổng tiền sản phẩm: ${order.sumproductcost}đ;</h3>`+
        `<h3>Phí vận chuyển: ${order.sumshipcost}đ;</h3>`+
        `<h3>Tổng tiền đơn hàng: ${order.sumproductcost + order.sumshipcost}đ;</h3>`+
        `<h3>DANH SÁCH SẢN PHẨM:</h3>`;
        let diachi =`<h3>Địa chỉ nhận hàng: ${order.address}</h3>`
        let numberRandom = randomInt(100000,999999);
        let linkXacNhan = "<h4>Link xác nhận đơn hàng: http://localhost:3000/checkout/"+txtTo+"/"+numberRandom+"</h4>";
        //Luu vao databse;
        Order.update({_id:id},{$set:{code:numberRandom, time: new Date().toLocaleString(), timestamp: parseInt(Date.now().toString())}},function(err,data){
            let txtContent = donhang+dssp+diachi+linkXacNhan;
            sendmail(txtTo,txtSubject,txtContent);
            res.send("Gửi thành công!");
        });
    });

    app.get("/checkout/:email/:code",(req,res)=>{
        var currentDay = getCurrentDay();
        var dataProduct=[];
        Statistic.findOne({ day: currentDay }, function (err, data) {
            if (data) {
                var listOrderToday = data.orderproduct; //Tất cả order trong ngày
                Order.findOne({ email: req.params.email, code: req.params.code }, function (err, order) {
                    console.log(order);
                    if (order && order.status == "unconfirmed") { //nếu trạng thái unconfirmed mới thực hiện cập nhật
                        console.log("vào dc")
                        dataProduct = order.listproduct;
                        var ok;
                        var result = [];
                        for (var i = 0; i < dataProduct.length; i++) {
                            ok = false;
                            for (var j = 0; j < listOrderToday.length; j++) {
                                if (dataProduct[i].id.equals(listOrderToday[j].id)) {
                                    ok = true;
                                    var itemresult = {
                                        id: dataProduct[i].id,
                                        count: dataProduct[i].quanty + listOrderToday[j].count
                                    }
                                    result.push(itemresult);
                                    break;
                                }
                            }
                            if (ok == false) {
                                var itemresult = {
                                    id: dataProduct[i].id,
                                    count: dataProduct[i].quanty
                                }
                                result.push(itemresult);
                            }
                        }

                        for (var i = 0; i < dataProduct.length; ++i) {
                            Product.findOneAndUpdate(
                                { _id: dataProduct[i].id },
                                { $inc: { "sizes.$[filter1].colors.$[filter2].quanty": -dataProduct[i].quanty } },
                                { arrayFilters: [{ 'filter2.color': dataProduct[i].color }, { 'filter1.size': dataProduct[i].size }] },
                                function (err, data) {
                                })
                        }
                        for (var i = 0; i < dataProduct.length; ++i) {
                            Product.findOneAndUpdate({ _id: dataProduct[i].id }, { $inc: { quanty: -dataProduct[i].quanty } }, function (err, data) {

                            })
                        }
                        //cập nhật vào thống kê
                        Statistic.update({ day: currentDay }, { $set: { orderproduct: result } }, function (err, data) {
                            if (err) console.log(err);
                        });
                        //Tăng số lượt đặt hàng của khách hàng --> để thống kê
                        User.findOneAndUpdate({email:req.params.email},{$inc:{qorder:1}},function(err,data){
                            if (err) console.log(err);
                        })
                        //Cập nhật trạng thái confirmed
                        Order.update({ email: req.params.email, code: req.params.code }, { $set: { status: "confirmed", time: new Date().toLocaleString(), timestamp: parseInt(Date.now().toString()) } }, function (err, data) {
                            if (err) {
                                throw err;
                            } else {
                                Order.update({ email: req.params.email, code: req.params.code},
                                    {$set:{"listproduct.$[].status":"confirmed"}},function(err,data){
                                        
                                    })
                                let txtTo = req.params.email;
                                let txtSubject = "THÔNG BÁO TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
                                let txtContent = "<h3>Bạn đã xác nhận đơn hàng thành công với mã đơn hàng: " + req.params.code + "</h3>";
                                sendmail(txtTo, txtSubject, txtContent);
                                User.findOneAndUpdate({ email: req.params.email }, { $set: { cart: [] } }, function (err, data) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        res.redirect("/ordersuccess");
                                    }
                                })
                            }
                        });
                    }
                })
            }
        });    
    });
    app.post("/addNewDay",(req,res)=>{
        var day = getCurrentDay();
        Statistic.findOne({day:day},function(err,data){
            if (!data){
                var newDay = {
                    day: getCurrentDay(),
                    viewProduct:[],
                    orderproduct:[],
                    page:0
                }
                Statistic.create(newDay,function(err,data){
                    res.json('Ok');
                });
            } else {
                res.json("");
            }
        })
    })
    app.get("/ordersuccess",(req,res)=>{
        res.render("dathangthanhcong");
    })
    app.post("/getSingleUser",parser,(req,res)=>{
        const email = req.body.email;
        User.findOne({email:email},function(err,data){
            if (!err&&data){
                res.send(data);
            }
        })
    })
}