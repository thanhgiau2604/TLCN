
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const stripe = require('stripe')("sk_test_51GxtcJBNzoYoLG3r8ZdoDAmSvQ35jO1ISEtl8ixkFN9jr6BPzP6ScpsQSsUyziSIUhOWLIWo5FyjmR7xBx2tXpXh00zWIgJJts");
const { v4: uuidv4 } = require('uuid');
module.exports = function(app){
    // app.get("/stripe",(req,res)=>{
    //   res.render("stripe");
    // })
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
       console.log("Charge",{charge});
       status="success";
     } catch (error) {
        console.log("Error",error);
        status="failure";
     }
      })
}