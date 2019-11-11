const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Admin = require("../models/admin");
module.exports = function(app){
    app.get("/loginAdmin",(req,res)=>{
        res.render("dangnhapAdmin");
    })
    // var admin = {
    //     email : "16110317@student.hcmute.edu.vn",
    //     firstName : "Nguyen",
    //     lastName : "Thanh Giau",
    //     numberPhone : "0969315430",
    //     dob : "26/04/1998",
    //     password : "123456789",
    //     address : "Di An, Binh Duong",
    //     "__v" : 0
    // }
    // Admin.create(admin);
    app.post("/loginadmin",parser,(req,res)=>{
        const emailorphone = req.body.emailphone;
        const password = req.body.psw;
        Admin.findOne({$or:[
            {email:emailorphone},
            {numberPhone:emailorphone}
        ]}).select("email firstName lastName numberPhone dateofBirth password address").exec(function(err,ad){
            console.log(ad);
            if (err){
                res.send(err);
            } else {
                if (!ad){
                    res.json({err:1,message:"Không đúng Email/SDT hoặc password"});
                } else {
                    var validPassword = ad.comparePassword(password);
                    if (!validPassword){
                        res.json({err:1,message:"Không đúng Email/SDT hoặc password"});
                    } else {                       
                        res.json({err:0,username:ad.lastName,email:ad.email});
                    }
                }
            }
        });
    })
    app.get("/dashboard",(req,res)=>{
        res.send("Dashboard");
    })
}