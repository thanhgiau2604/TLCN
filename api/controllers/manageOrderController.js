const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Product = require("../models/Product");
const Order = require("../models/order");
function getOrder(res) {
    Order.find({}).sort({timestamp:'descending'}).exec(function(err,data){
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({success:1,lOrder:data});
        }
    })
}
module.exports = function(app){
    app.get("/manageorder",(req,res)=>{
        res.render("quanlydonhang");
    });

    app.get("/getAllOrders",(req,res)=>{
        Order.find({}).sort({timestamp:'descending'}).exec(function(err,data){
            if (err) {
                res.status(500).json(err);
            } else {
                res.send(data);
            }
        })
    });
    app.get("/getOrder",(req,res)=>{
        const id = req.query.id;
        Order.findOne({_id:id},function(err,data){
            if (err){
                throw err;
            } else {
                res.json(data);
            }
        })
    })
    app.post("/updateStatus",parser,(req,res)=>{
        const status = req.body.status;
        const id = req.body.id;
        console.log(status);
        console.log(id);
        Order.update({_id:id},{$set:{status:status}},function(err,data){
            if (err){
                throw err;
            } else {
                getOrder(res);
            }
        })
    })
    //search order
    app.post("/searchorder",parser,(req,res)=>{
        const keysearch = req.body.keysearch;
        Order.find({email: {$regex : ".*"+keysearch+".*",'$options' : 'i' }},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    });

    app.post("/deleteOrder",parser,function(req,res){
        const id = req.body.id;
        Order.remove({_id:id},function(err,data){
            if (err){
                throw err;
            } else {
                getOrder(res);
            }
        })
    })
}