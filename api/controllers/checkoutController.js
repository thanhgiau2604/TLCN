const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
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
        var count = 0;
        order.listproduct.forEach(e => {
            count++;
            var strsp = `<p>${count}. Tên sản phẩm: ${e.name}; Số lượng: ${e.quanty}; Màu sắc:${e.color}; Size: ${e.size}; Giá sản phẩm: ${e.cost}đ</p>`;
            dssp = dssp + strsp;
        });
        let donhang = 
        "<h3>Đơn hàng của anh/chị:"+order.address.fullname+"- SDT:"+order.address.phonenumber+"</h3>"+
        `<h3>Tổng tiền sản phẩm: ${order.sumproductcost}đ;</h3>`+
        `<h3>Phí vận chuyển:${order.sumshipcost}đ;</h3>`+
        `<h3>Tổng tiền đơn hàng:${order.sumproductcost + order.sumshipcost}đ;</h3>`+
        `<h3>DANH SÁCH SẢN PHẨM:</h3>`;
        let diachi =`<h3>Địa chỉ nhận hàng: ${order.address.apartmentnumber}-${order.address.commune}-${order.address.district}-${order.address.province}</h3>`
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
    })
}