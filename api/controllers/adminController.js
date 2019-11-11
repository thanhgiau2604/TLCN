const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Admin = require("../models/admin");
module.exports = function(app){
    app.get("/loginAdmin",(req,res)=>{
        res.render("dangnhapAdmin");
    })
    app.post("/loginAdmin",parser,(res,req)=>{
        const emailphone = req.body.emailphone;
        const password = req.body.psw;

    })
}