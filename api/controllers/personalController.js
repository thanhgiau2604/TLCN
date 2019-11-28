const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const Message = require("../models/message");
module.exports = function(app,apiRouter){
    app.post("/getInforUser",parser,(req,res)=>{
        var email = req.body.email;
        User.findOne({email:email},function(err,data){
            if (err){
                throw err;
            } else {
                return res.json(data);
            }
        })
    });
    app.post("/editinfor",parser,(req,res)=>{
        const phone = req.body.phone;
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const dob = req.body.day+"/"+req.body.month+"/"+req.body.year;

        console.log(firstname+"/"+lastname+"/"+phone+"/"+email+"/"+dob);
        User.update({email:email},{$set:{firstName:firstname,lastName:lastname,numberPhone:phone,
        dob:dob}},function(err,data){
            if (err){
                throw err;
            }
            User.findOne({email:email},function(err,data){
                res.json(data);
            });  
        })
    });
    app.get("/changepassword",(req,res)=>{
        res.render("doimatkhau");
    });
    app.post("/changepassword",parser,(req,res)=>{
        const oldpass = req.body.oldpass;
        const newpass = req.body.newpass;
        const repass = req.body.repass;
        var err="";
        if (!oldpass||!newpass||!repass){
            err="Vui lòng nhập đầy đủ tất cả các trường"
            res.send({err:err,user:""});
        } else 
        if (newpass!=repass){
            err="Mật khẩu và xác nhận mật khẩu không khớp!";
            res.send({err:err,user:""});
        } else {
            const email = req.body.email;
            User.findOne({email:email}).select("email firstName lastName numberPhone dateofBirth password").
            exec(function(err,user){
                console.log(user);
                if (err){
                    res.send({err:err,user:""})
                } else {
                    validPassword = user.comparePassword(oldpass);
                    if (!validPassword){
                        res.send({err:"Mật khẩu cũ không đúng",user:""});
                    } else {
                        User.update({email:email},{$set:{password:newpass}},function(err,data){
                            if (err){
                                throw err;
                            } else {
                                res.send({err:""});
                            }
                        })
                    }
                }
            })
        }
    });

    app.get("/message",(req,res)=>{
        res.render("tinnhan");
    });

    app.get("/getMessage",(req,res)=>{
        Message.find({}).sort({index:'descending'}).exec(function(err,data){
            if (err){
                throw err;
            } else {
                res.json(data);
            }
        })
    });


    app.get("/manageaccount",(req,res)=>res.render("quanlytaikhoan"));
    app.get("/personalinfor",(req,res)=> res.render("thongtincanhan"));
}