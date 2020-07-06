var paypal = require("paypal-rest-sdk");
var Order = require("../models/order");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const usdtovnd = 23281.5;

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
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AVvkPi1HodaQ5XMFQ56Q77Zm1Sksj7XysxuFYdf91wVn7o6OYAmnCea7fFA3iAitsecLivHV9lxgPD8t',
        'client_secret': 'EIPZwSbS7T9dZC9hPSeQSia9-zYT4b9dXD8cyT67yyfXAhddvPCQCYvcwifyPeBkbkUs89gEtlhlfFkK'
      });
    app.post("/payment",parser,(req,res)=>{
        var listProduct = JSON.parse(req.body.data);
        var ship = req.body.ship;
        var code = req.body.code;
        var email = req.body.email;
        var voucher = req.body.voucher;
        var listItems = [];
        var subtotal = 0;
        for (var i=0; i<listProduct.length; i++){
            var item = {
                "name": listProduct[i].name,
                "sku": "item",
                "price": parseFloat(listProduct[i].cost/usdtovnd).toFixed(2),
                "currency": "USD",
                "quantity": listProduct[i].quanty
            }
            subtotal += (item.price*item.quantity);
            listItems.push(item);
        }
        console.log(voucher);
        if (voucher>0){
            var itemDiscount = {
                "name": "Discount",
                "sku":"item",
                "price": -parseFloat(voucher/usdtovnd).toFixed(2),
                "currency": "USD",
                "quantity": 1
            }
                listItems.push(itemDiscount);
                subtotal += itemDiscount.price; 
        }

        var shipping = parseFloat(ship/usdtovnd).toFixed(2);
        subtotal = parseFloat(subtotal).toFixed(2);
        var total = (parseFloat(subtotal)+ parseFloat(shipping)).toFixed(2);
        console.log(subtotal+" "+shipping+" "+total);
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/paymentSuccess/"+total+"/"+code,
                "cancel_url": "http://localhost:3000/paymentCancel/"+email+"/"+code
            },
            "transactions": [{
                "item_list": {
                    "items": listItems
                },
                "amount": {
                    "currency": "USD",
                    "total": total,
                    "details": {
                        "subtotal": subtotal,
                        "shipping": shipping
                    }
                },
                "description": "Payment through paypal"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error);
                res.send({err:true});
            } else {
                for (let i=0; i<payment.links.length; i++){
                    if (payment.links[i].rel==="approval_url")
                        res.send({err:false,link:payment.links[i].href});
                }
            }
        });
    })
    app.get("/paymentSuccess/:total/:code",(req,res)=>{
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const total = req.params.total;
        const code = req.params.code;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total
                }
            }]
          };
        
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                const sale = payment.transactions[0].related_resources[0].sale;
                const paypalSale = {
                    idSale : sale.id,
                    amount : sale.amount.total
                }
                Order.findOneAndUpdate({code:code},{$set:{payment:true,paymentMethod:"paypal"},
                paypalSale:paypalSale,timestamp:parseInt(Date.now().toString()),status:"Payment Success",
                time:getCurrentDayTime()},function(err,data){
                    if (err) console.log(err);
                    else console.log(data);
                });
                res.redirect("/payment?method=paypal&code="+code);
            }
        });
    })
    app.get('/paymentCancel/:email/:code', (req, res) => {
        res.redirect("/ordersuccess/"+req.params.email+"/"+req.params.code);
    });

    app.post("/getListProductOrder",parser,(req,res)=>{
        var code = req.body.code;
        Order.findOne({code:code},function(err,data){
            if (err) {
                console.log(err);
            } else {
                res.send(data);
            }
        })
    });
    app.post("/paypalrefund",parser,(req,res)=>{
        var idSale = req.body.idSale;
        var data = {
            "amount": {
                "currency":"USD",
                "total": req.body.total
            }
        }
        console.log(req.body.idSale);
        console.log(req.body.total);
        paypal.sale.refund(idSale,data,function(err,refund){
            if (err){
                res.send({success:false});
            } else {
                res.send({success:true});
            }
        })
    })
    console.log(new Date("3 July 2020").getTime());
}