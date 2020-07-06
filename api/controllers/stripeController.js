
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const stripe = require('stripe')("sk_test_51GxtcJBNzoYoLG3r8ZdoDAmSvQ35jO1ISEtl8ixkFN9jr6BPzP6ScpsQSsUyziSIUhOWLIWo5FyjmR7xBx2tXpXh00zWIgJJts");
const { v4: uuidv4 } = require('uuid');
var Order = require("../models/order");
module.exports = function(app){

    app.post("/checkout/stripe",parser,async (req,res)=>{
      const body = JSON.parse(req.body.data);
      const product = body.product;
      const token = body.token;
     try {
       const customer = await 
       stripe.customers.create({
         email: token.email,
         source: token.id
       });
       const idempotencyKey = uuidv4();
       const charge = await stripe.charges.create({
         amount: product.price,
         currency: "vnd",
         customer: customer.id,
         receipt_email: token.email,
         description: "Purchase the " + product.name,
         shipping: {
           name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
         }
       },{idempotencyKey});
       console.log("Charge",charge);
       status="success";
       res.json({success:true,chargeId:charge.id});
     } catch (error) {
        console.log("Error",error);
        status="failure";
        res.json({success:false})
     }
    });
    app.post("/updateOrderStripe",parser,(req,res)=>{
      const code = req.body.code;
      const chargeId = req.body.chargeId;
      console.log(code);
      Order.findOneAndUpdate({code:code},{$set:{payment:true,paymentMethod:"stripe",
      status:"Payment Success",stripeChargeId:chargeId}},function(err,data){
        if (err) console.log(err)
        if (!err&&data){
          res.json({ok:1});
        }
      })
    })
    app.post("/stripeRefund",parser,(req,res)=>{
      const chargeId = req.body.chargeId;
      stripe.refunds.create(
        {charge: chargeId},
        function(err, refund) {
          if (err) {
            res.json({refund:false});
          }
          else {
            res.json({refund:true});
            console.log(refund);
          }
        }
      );
    })
}