var paypal = require("paypal-rest-sdk");
var Order = require("../models/order");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const usdtovnd = 23281.5;
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
        var shipping = parseFloat(ship/usdtovnd).toFixed(2);
        var total = parseFloat(subtotal)+parseFloat(shipping);
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/paymentSuccess/"+total+"/"+code,
                "cancel_url": "http://localhost:3000/paymentCancel"
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
            } else {
                for (let i=0; i<payment.links.length; i++){
                    if (payment.links[i].rel==="approval_url")
                        res.send(payment.links[i].href);
                }
            }
        });
    })
    app.get("/paymentSuccess/:total/:code",(req,res)=>{
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const total = req.params.total;
        const code = req.params.code;
        console.log("code để update nè "+ code);
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
                Order.findOne({code:code},{$set:{payment:true}});
                res.redirect("/ordersuccess")
            }
        });
    })
    app.get('/paymentCancel', (req, res) => res.send('Cancelled'));

    app.post("/getListProductOrder",parser,(req,res)=>{
        var code = req.body.code;
        Order.findOne({code:code},function(err,data){
            if (err) {
                console.log(err);
            } else {
                res.send(data);
            }
        })
    })
}