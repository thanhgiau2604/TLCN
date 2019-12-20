const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Admin = require("../models/admin");
const User = require("../models/users");

function getUsers(res) {
    User.find({role:'user'},function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data);
        }
    })
}
module.exports = function(app,adminRouter,jwt){
    var superSecret = 'iamastudent';
    adminRouter.use(function(req,res,next){
        var token = req.query.token || req.params.token;
        if (token){
            console.log(token);
            jwt.verify(token,superSecret,function(err,decoded){
                if (err){
                    return res.json({success:0,message:'Failed to authenticate token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.status(403).send({
                success:0
            })
        }
    });
    adminRouter.get("/",(req,res)=>{
        res.send({success:1});
    })
    app.get("/loginAdmin",(req,res)=>{
        res.render("dangnhapAdmin");
    })
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
        res.render("dashboard");
    });
    app.get("/manageuser",(req,res)=>{
        res.render("quanlyuser");
    });
    app.get("/getListUsers",(req,res)=>{
        User.find({role:'user'},function(err,data){
            res.send(data);
        })
    });
    app.post("/deleteUser",parser,(req,res)=>{
        const id = req.body.id;
        User.remove({_id:id},function(err,data){
            getUsers(res);
        })
    });

    app.post("/updateUser",parser,(req,res)=>{
        const id = req.body.id;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const dob = req.body.dob;
        User.update({_id:id},{$set:{firstName:firstname, lastName:lastname, email:email, 
            numberPhone:phone, dob:dob}},function(err,data){
                getUsers(res);
        })
    });

    app.post("/addUser",parser,(req,res)=>{
        var user = {
            firstName:  req.body.firstname,
            lastName: req.body.lastname,
            email:req.body.email,
            numberPhone: req.body.phone,
            dob: req.body.dob,
            password: "12345678",
            role:'user'
        }
        User.create(user,function(err,data){
            if (err){
                throw err;
            } else {
                getUsers(res);
            }
        })
    })

    app.get("/changepswad",(req,res)=>{
        res.render("doimatkhauAdmin");
    });
    app.get("/manageproduct",(req,res)=>{
        res.render("quanlysanpham");
    });

    //search user
    app.post("/searchuser",parser,(req,res)=>{
        const keysearch = req.body.keysearch;
        User.find({$or:[
            {firstName:{$regex : ".*"+keysearch+".*",'$options' : 'i' }},
            {lastName: {$regex : ".*"+keysearch+".*",'$options' : 'i' }},
            {email:{$regex : ".*"+keysearch+".*",'$options' : 'i' }},
            {numberPhone:{$regex : ".*"+keysearch+".*",'$options' : 'i' }}
        ]},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    })
}