const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const Order = require("../models/order");
const Product = require("../models/Product");
const sendmail = require("./mail");
var Statistic = require("../models/statistic");
const NodeGeocoder = require('node-geocoder');
var distance = require('google-distance');
const Nexmo = require("nexmo");
var _eQuatorialEarthRadius = 6378.1370;
var _d2r = (Math.PI / 180.0);
var arrUserOnline = [];
var arrStateProduct = [];
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
//Định dạng ngày
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
//format tiền tệ VND
function formatCurrency(cost){
    return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
//format thời gian để lưu vào đơn hàng
function getCurrentDayTime() {
    offset = "+7";
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var day = new Date(utc + (3600000*offset));
    var nowday = day.getDate().toString()+"-"+(day.getMonth()+1).toString()+"-"+day.getFullYear().toString()+" "
    +day.getHours().toString()+":"+day.getMinutes().toString();
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
    app.post("/updateOrder",parser,(req,res)=>{
        const order = JSON.parse(req.body.order);
        const id = req.body.id;
        Order.update({_id:id},{$set:{time:order.time,timestamp:order.timestamp,sumproductcost:order.sumproductcost,
        listproduct:order.listproduct}},function(err,data){
            if (err) console.log(err); else res.send("Ok");
        })
    })
    app.post("/updateAddress",parser,(req,res)=>{
        const address = req.body.address;
        const fullname = req.body.fullname;
        const phonenumber = req.body.phonenumber;
        const email = req.body.email;
        const id = req.body.id;
        const sumcost = req.body.sumcost;
        const voucher = req.body.voucher;
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
                var result;
                if (sumcost>800000){
                    result=0;
                } else {
                    if (data.distanceValue <= 3000) result = 0;
                    else result = 3*(data.distanceValue-3000);
                }
                Order.update({ _id:id}, {$set:{address:address,fullname:fullname,phonenumber:phonenumber,
                    sumshipcost:result,costVoucher:voucher}}, function (err, or) {
                    if (err) {
                        console.log(err);
                    } else {
                        Order.findOne({ _id: id }, function (err, order) {
                            if (err) {
                                throw err;
                            } else {
                                console.log(order.sumproductcost);
                                if (order.sumproductcost >=800000) result=0;
                                res.json({err:0,data:order,ship:result,distance:data.distanceValue});
                            }
                        })
                    }
                });
              }
          });

        //mốt xóa khúc dưới đi
        // var result = 10000;
        // var distanceResult = 3000;
        // Order.update({ _id:id}, {$set:{address:address,fullname:fullname,phonenumber:phonenumber,
        //                 sumshipcost:result,costVoucher:voucher}}, function (err, or) {
        //                 if (err) {
        //                     console.log(err);
        //                 } else {
        //                     Order.findOne({ _id: id }, function (err, order) {
        //                         if (err) {
        //                             throw err;
        //                         } else {
        //                             if (order.sumproductcost >=800000) result=0;
        //                             res.json({err:0,data:order,ship:result,distance:distanceResult});
        //                         }
        //                     })
        //                 }
        //             });
    });
    app.post("/sendmail",parser,(req,res) => { //KHOẢNG CÁCH VẬN CHUYỂN ĐƯA VÀO SAU
        const order = JSON.parse(req.body.order);
        const ship = req.body.ship;
        const id = req.body.id;
        const distance = req.body.distance;
        let txtTo = order.email;
        let txtSubject = "XÁC NHẬN ĐƠN HÀNG TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
        let dssp ="";
        var count = 0;
        var strsp = `<table style="" width="90%">
        <thead>
            <tr>
                <th align="center" style="padding:10px; border:1px solid #333">#</th>
                <th align="center" style="padding:10px; border:1px solid #333">Tên sản phẩm</th>
                <th align="center" style="padding:10px; border:1px solid #333">Số lượng</th>
                <th align="center" style="padding:10px; border:1px solid #333">Màu sắc</th>
                <th align="center" style="padding:10px; border:1px solid #333">Kích cỡ</th>
                <th align="center" style="padding:10px; border:1px solid #333">Giá sản phẩm</th>
            </tr>
        </thead>
            <tbody>`
        order.listproduct.forEach(e => {
            count++;
            if (e.size==0) e.size='default';
            strsp += `<tr >
                        <td align="center" style="padding:10px; border:1px solid #333">${count}</td>
                        <td align="center" style="padding:10px; border:1px solid #333">${e.name}</td>
                        <td align="center" style="padding:10px; border:1px solid #333">${e.quanty}</td>
                        <td align="center" style="padding:10px; border:1px solid #333">${e.color}</td>
                        <td align="center" style="padding:10px; border:1px solid #333">${e.size}</td>
                        <td align="center" style="padding:10px; border:1px solid #333">${formatCurrency(e.cost)}</td>
                   </tr>`
            // var strsp = `<p>${count}. Tên sản phẩm: ${e.name}; Số lượng: ${e.quanty}; Màu sắc:${e.color}; Size: ${e.size}; Giá sản phẩm: ${e.cost}đ</p>`;
        });
        strsp += "</tbody> </table>"
        dssp = dssp + strsp;  
        var voucher = "";
        if (order.costVoucher>0) 
        voucher = `<h3 style='font-weight:normal'><b>Giảm giá (voucher): </b>${formatCurrency(order.costVoucher)}đ</h3>`
        let donhang =
        "<h2><b>THÔNG TIN ĐƠN HÀNG</b></h2>" +
        "<h3 style='font-weight:normal'><b>Đơn hàng của anh/chị:</b> "+order.fullname+"- SDT:"+order.phonenumber+"</h3>"+
        `<h3 style='font-weight:normal'><b>Tổng tiền sản phẩm:</b> ${formatCurrency(order.sumproductcost)};</h3>`+
        `<h3>Địa chỉ nhận hàng: ${order.address}</h3>`+
        `<h3>Địa chỉ kho hàng: Số 01, Võ Văn Ngân, Thủ Đức, Hồ Chí Minh</h3>`+
        `<h3>Khoảng cách vận chuyển: ${parseFloat(distance/1000).toFixed(2)}km</h3>`+
        `<h3 style='font-weight:normal'><b>Phí vận chuyển:</b> ${formatCurrency(order.sumshipcost)};</h3>`+ voucher+
        `<h3 style='font-weight:normal'><b>Tổng tiền đơn hàng:</b> ${formatCurrency(order.sumproductcost + order.sumshipcost-order.costVoucher)};</h3>`+
        `<h3>DANH SÁCH SẢN PHẨM:</h3>`;
        let numberRandom = randomInt(100000,9999999);
        let linkXacNhan = "<h4>Link xác nhận đơn hàng: http://localhost:3000/confirm/"+txtTo+"/"+numberRandom+"</h4>";
        //Luu vao databse;
        Order.findOneAndUpdate({_id:id},{$set:{code:numberRandom, time: getCurrentDayTime(), timestamp: parseInt(Date.now().toString())}},function(err,data){
            let txtContent = "<div style='color:black'>"+donhang+dssp+linkXacNhan+"</div>"
            sendmail(txtTo,txtSubject,txtContent,function(err,data){
                if (err){
                    console.log(err);
                    res.send({err:1})
                } else {
                    res.send({err:0})
                }
            });
            res.send("Gửi thành công!");
        });
    });
    const nexmo = new Nexmo({
        apiKey: "19fbc77f",
        apiSecret: "F0CXdcbSm5KHXec5"
      }, {debug:true});
    app.post("/sendSMS",parser,(req,res)=>{
        var number = req.body.phone;
        const order = JSON.parse(req.body.order);
        const ship = req.body.ship;
        const id = req.body.id;
        const sum = parseInt(order.sumproductcost)+parseInt(ship)-parseInt(order.costVoucher);
        if (number[0]=="0"){
            number = number.replace("0","84");
        }
        Order.find({},{code:1,_id:0},function(err,data){
            if (err){
                console.log(err);
            } else {
                let numberRandom = randomInt(100000,9999999);
                while (data.findIndex(item => item.code===numberRandom)!=-1){
                    numberRandom = randomInt(100000,9999999);
                }
                var messageSend = "Code: "+numberRandom;
                Order.findOneAndUpdate({_id:id},{$set:{code:numberRandom, 
                    time: getCurrentDayTime(), timestamp: parseInt(Date.now().toString())}},function(err,data){
                        if (err){
                            console.log(err);
                        } else {
                             nexmo.message.sendSms("84965450908",number,messageSend,{type: "unicode" },
                              (err, responseData) => {
                                if (err) {
                                  res.json({ err: 1 });
                                } else {
                                  console.log(responseData);
                                  res.json({err: 0,code:numberRandom});
                                }
                              }
                            );
                        }
                })
            }
        })  
    });
    app.get("/confirm/:email/:code",(req,res)=>{
        Order.findOne({code: req.params.code }, function (err, order) {
            if (err){
                console.log(err);
            } else {
                if (order && order.status == "unconfirmed") { 
                    res.redirect("/ordersuccess/"+req.params.email+"/"+req.params.code)
                } else {
                    res.redirect("/ordersuccess/"+"confirmed"+"/"+req.params.code);
                }
            }
        })
    })

    app.get("/check/:code", (req,res)=>{
        let code = req.params.code;
        var arrErrorProduct = [];
        var arrValidProduct = [];
        var loop = async _ => {
            var data = await Order.findOne({code:code},function(err,data){});
            if (data&&data.listproduct.length>0){
                for (var i=0; i<data.listproduct.length; i++){
                    var pOrder = data.listproduct[i];   
                    var product = await Product.findOne({_id:pOrder.id},function(err,pro){});
                    var addProduct = product;
                    if (product){
                        let index = product.sizes.findIndex(item => item.size===pOrder.size);
                        if (index!=-1){
                            var compareQuantity;
                            var indexProduct = arrStateProduct.findIndex(pro => pro.name == product.name);
                            let pos = product.sizes[index].colors.findIndex(item => item.color===pOrder.color);
                            if (indexProduct !=-1) compareQuantity = arrStateProduct[indexProduct].sizes[index].colors[pos].quanty;
                            else compareQuantity = product.sizes[index].colors[pos].quanty;
                            if (compareQuantity<pOrder.quanty){
                                arrErrorProduct.push(pOrder);
                            } else {
                                arrValidProduct.push(pOrder);
                                addProduct.sizes[index].colors[pos].quanty -=pOrder.quanty;
                                var vt = arrStateProduct.findIndex(product => product.name==addProduct.name);
                                if (vt == -1)  {arrStateProduct.push(addProduct)} else
                                {
                                    arrStateProduct.splice(vt,1);
                                    arrStateProduct.push(addProduct)
                                }
                            }
                        }
                    }
                }
            }
            res.json({dataErr:arrErrorProduct,dataValid:arrValidProduct,voucher: data.costVoucher});
        }
        loop();
    })
    app.get("/checkout/:email/:code",(req,res)=>{
        console.log("vô 1");
        var currentDay = getCurrentDay();
        var dataProduct=[];
        var infor = req.params.email;
        var typeInfor = 'email';
        var phoneno = /^\d{10}$/;
        if (infor[0]=='8'&&infor[1]=='4')  phoneno = /^\d{11}$/;
        if(infor.match(phoneno)) typeInfor="phone";
        const forLoop = async _ => {
            const data = await Statistic.findOne({ day: currentDay }, function (err, data) {});
            if (data){
                var listOrderToday = data.orderproduct;
                const order = await Order.findOne({code: req.params.code }, function (err, order) {});
                if (order && order.status == "unconfirmed") {
                    dataProduct = order.listproduct;
                    var ok;
                    var result = listOrderToday;
                    for (var i = 0; i < dataProduct.length; i++) {
                        ok = false;
                        for (var j = 0; j < listOrderToday.length; j++) {
                            if (dataProduct[i].id.equals(listOrderToday[j].id)) {
                                ok = true;
                                var itemresult = listOrderToday[j];
                                itemresult.count += dataProduct[i].quanty;
                                result[j] = itemresult;
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
                    // console.log(dataProduct);
                    for (var i = 0; i < dataProduct.length; ++i) {
                          Product.findOneAndUpdate(
                            { _id: dataProduct[i].id },
                            { $inc: { "sizes.$[filter1].colors.$[filter2].quanty": -dataProduct[i].quanty }},
                            { arrayFilters: [{ 'filter2.color': dataProduct[i].color }, { 'filter1.size': dataProduct[i].size }] },
                            function (err, data) {})
                    }
                    for (var j = 0; j < dataProduct.length; ++j) {
                        console.log(dataProduct[j]);
                        Product.updateOne({_id: dataProduct[j].id}, {$inc:{quanty: -dataProduct[j].quanty,orders:dataProduct[j].quanty}}, 
                        function (err, data) {
                            if (err) console.log(err);
                            else console.log(data);
                        })
                    }
                    if (order.costVoucher>0){
                        await User.findOneAndUpdate({$or:[{email:req.params.email},{numberPhone:req.params.email}]},
                            {$pull:{currentVoucher:{value:order.costVoucher}}},{new:true},function(err,data){
                                // if (err) console.log(err); else
                                // console.log(data);
                            })
                    }
                    //cập nhật vào thống kê
                    await Statistic.findOneAndUpdate({ day: currentDay }, { $set: { orderproduct: result } }, function (err, data) {
                    });
                    //Tăng số lượt đặt hàng của khách hàng --> để thống kê
                    const dataUser = await User.findOneAndUpdate({$or:[{email:req.params.email},{numberPhone:req.params.email}]},{$inc:{qorder:1}},{new:true},function(err,data){
                    });
                    if (dataUser){
                        if (dataUser.qorder%5==0){
                            var value = Math.floor(dataUser.qorder/5)*50000;
                            await User.findOneAndUpdate({$or:[{email:req.params.email},{numberPhone:req.params.email}]},
                                {$push:{currentVoucher:{value:value}}},{new:true},function(err,data){
                            })
                        }
                    }
                    //Cập nhật trạng thái confirmed
                    await Order.update({code: req.params.code }, { $set: { status: "confirmed", time: getCurrentDayTime(), timestamp: parseInt(Date.now().toString()) } }, function (err, data) {
                    });
                    await Order.update({code: req.params.code},{$set:{"listproduct.$[].status":"confirmed"}},function(err,data){ })
                    if (typeInfor=="email"){
                        let txtTo = req.params.email;
                        let txtSubject = "THÔNG BÁO TỪ SHOELG - SHOP BÁN GIÀY ONLINE";
                        let txtContent = "<h3>Bạn đã xác nhận đơn hàng thành công với mã đơn hàng: " + req.params.code + "</h3>";
                        sendmail(txtTo, txtSubject, txtContent);
                    }
                    await User.findOneAndUpdate({$or:[{email:req.params.email},{numberPhone:req.params.email}]}, { $set: { cart: [] } }, function (err, data) {
                    })
                    res.send("UPDATED");
                } else res.send("NOT UPDATE");
            }
        }
        forLoop();  
    });
    app.post("/updateCart",parser,(req,res)=>{
        const email1 = req.body.email1;
        const email2 = req.body.email2;
        User.findOneAndUpdate({$or:[{email:email1},{email:email2},{numberPhone:email1}]},{$set:{cart:[]}},function(err,data){
            if (!err&&data){
                res.send("OK");
            }
        })
    })
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
    app.get("/ordersuccess/confirmed/:code",(req,res)=>{
        res.render("dathangthanhcong");
    })
    app.get("/ordersuccess/:email/:code",(req,res)=>{
        Order.findOne({code: req.params.code }, function (err, order) {
            if (err){
                console.log(err);
            } else {
                if (order && order.status == "unconfirmed") { 
                    res.render("dathangthanhcong");
                } else {
                    res.redirect("/ordersuccess/"+"confirmed"+"/"+req.params.code);
                }
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
    //get number of user's vouchers
    app.post("/getVoucher",parser,(req,res)=>{
        const email = req.body.email;
        const phone = req.body.phone;
        console.log("email="+email);
        if (!phone) phone=-1;
        User.findOne({$or:[{email:email},{numberPhone:phone}]},function(err,data){
            if (err) console.log(err);
            else {
                if (data){
                    res.json({voucher:data.currentVoucher})
                }
            }
        })
    })
    //update order when change list product when got an error
    app.post("/updateWhenEditProduct",parser,(req,res)=>{
        let listProduct = JSON.parse(req.body.listProduct);
        let code = req.body.code;
        let voucher = req.body.voucher;
        let productSum = 0;
        listProduct.forEach(product => {productSum+=product.cost*product.quanty});
        if (voucher && voucher!=0){
            var k = Math.floor(voucher/50000);
            if (productSum<250000+(k*k-k)*50000) voucher = 0;
        }
        console.log(voucher);
        Order.findOneAndUpdate({code:code},{$set:{listproduct:listProduct,timestamp:parseInt(Date.now().toString()),
        time:getCurrentDayTime(),costVoucher:voucher,sumproductcost:productSum}},(err,data)=>{
            if (!err&&data){
                res.send("OK");
            }
        })
    })
    app.get("/payment",(req,res)=>{
        res.render("thanhtoan");
    });
}