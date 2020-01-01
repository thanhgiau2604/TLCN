const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const Order = require("../models/order");
const sendmail = require("./mail");
const opencage = require('opencage-api-client');
var Statistic = require("../models/statistic");
var _eQuatorialEarthRadius = 6378.1370;
var _d2r = (Math.PI / 180.0);
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
function HaversineInKM(lat1, long1, lat2, long2)
  {
      var dlong = (long2 - long1) * _d2r;
      var dlat = (lat2 - lat1) * _d2r;
      var a = Math.pow(Math.sin(dlat / 2.0), 2.0) + Math.cos(lat1 * _d2r) * Math.cos(lat2 * _d2r) * Math.pow(Math.sin(dlong / 2.0), 2.0);
      var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
      var d = _eQuatorialEarthRadius * c;
  
      return d;
 }

 function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    nowday = day.toString()+month.toString()+year.toString();
    return nowday;
}
module.exports = function(app,apiRouter){
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
        opencage.geocode({q: address}).then(data => {
            if (data.status.code == 200) {
              if (data.results.length > 0) {
                var place = data.results[0];
                res.json({err:"",position:place.geometry});
              } else {
                  res.json({err:"Vui lòng kiểm tra lại địa chỉ!"})
              }
            } else{
              console.log('have a problem');
            } 
          }).catch(error => {
            console.log('error', error.message);
          });
    })
    app.post("/updateAddress",parser,(req,res)=>{
        const address = req.body.address;
        const fullname = req.body.fullname;
        const phonenumber = req.body.phonenumber;
        const id = req.body.id;
        opencage.geocode({q: address}).then(data => {
            if (data.status.code == 200) {
              if (data.results.length > 0) {
                var place = data.results[0];
                var p1 = {
                    lat: 10.8496468,
                    lng: 106.7716404
                }
                var p2 = place.geometry;
                var distance = HaversineInKM(p1.lat,p1.lng,p2.lat,p2.lng);
                var result = Math.round(3000*distance);
                Order.update({ _id: id }, { $set: { address: place.formatted, fullname:fullname, phonenumber:phonenumber, sumshipcost:result} }, function (err, data) {
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
              } else {
                  res.json({err:1})
              }
            } else  {
              console.log('have a problem');
            }
          }).catch(error => {
            console.log('error', error.message);
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
        Statistic.findOne({day:currentDay},function(err,data){
            if (data){
                var listOrderToday = data.orderproduct;
                // console.log(listOrderToday);
                Order.findOne({email:req.params.email,code:req.params.code},function(err,order){
                    if (order)
                        var dataProduct = order.listproduct;       
                        var ok;
                        var result=[];
                        for (var i=0; i<dataProduct.length; i++){
                            ok=false;
                            for (var j=0; j<listOrderToday.length; j++){
                                if (dataProduct[i].id.equals(listOrderToday[j].id)){
                                    ok=true;
                                    var itemresult = {
                                        id:dataProduct[i].id,
                                        count: dataProduct[i].quanty+listOrderToday[j].count
                                    }
                                    result.push(itemresult);
                                    break;
                                }
                            }
                            if (ok==false){
                                var itemresult = {
                                    id:dataProduct[i].id,
                                    count:dataProduct[i].quanty
                                }
                                result.push(itemresult);
                            }
                        }
                        // console.log(result);
                        Statistic.update({day:currentDay},{$set:{orderproduct:result}},function(err,data){
                            if (err){
                                throw err;
                            } else {
                                console.log(data);
                            }
                        });
                })
            }
        });
        Order.update({email:req.params.email,code:req.params.code},{$set:{status:"confirmed", time: new Date().toLocaleString(), timestamp: parseInt(Date.now().toString())}},function(err,data){
            if (err){
                throw err;
            } else {
                let txtTo = req.params.email;
                let txtSubject = "THÔNG BÁO TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
                let txtContent = "<h3>Bạn đã xác nhận đơn hàng thành công với mã đơn hàng: " +req.params.code+"</h3>";
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
    });

    app.post("/addNewDay",(req,res)=>{
        var day = getCurrentDay();
        console.log(day);
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
}