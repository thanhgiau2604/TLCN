const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const passport = require("passport");
const passportfb = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const express = require("express");
const sendmail = require("./mail");
const time_exprired = "24h";
const Nexmo = require("nexmo");
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
async function checkInfor(email,phone,password){
        var existUser = await User.findOne({$or:[{email:email},{phoneNumber:phone}]},function(err,data){});
        if (existUser){
            return "Tài khoản đã tồn tại. Vui lòng thử email hoặc số điện thoại khác!"
        } else {
            if (password.length<6){
                return "Mật khẩu ít nhất là 6 kí tự. Khuyến khích sự kết hợp giữa in hoa, in thường, kí tự đặc biệt"
            } else return "OK";
        }
}
module.exports = function(app,apiRouter,jwt){
    var username="", email="",token,role="";
    var superSecret = 'iamastudent';
    app.get("/",(req,res)=> res.render("trangchu",{username:username}))
    app.post("/signup",parser,async (req,res)=>{
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const email = req.body.email;
        const phoneNumber = req.body.phonenumber;
        const password = req.body.password;
        const repass = req.body.repass;
        const dob = req.body.dob;
        const role='user';
        
        var err="";
        var resultCheckInfor = await checkInfor(email,phoneNumber,password);
        if (resultCheckInfor!="OK"){
            return res.json(resultCheckInfor)
        } else
        if (!firstName || !lastName || !email || !password || !repass) {
            err = "Không được bỏ trống các trường bắt buộc (*)";
            return res.json(err);
        } else {
            if (password != repass) {
                err = "Xác nhận mật khẩu không khớp!"
                return res.json(err);
            } else {
                var user = new User();
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                user.numberPhone = phoneNumber;
                user.password = password;
                user.dob = dob;
                user.role=role;
                user.qvisit = 0;
                user.qorder = 0;
                user.isDelete=0;
                user.save(function (err) {
                    if (err) {
                        if (err.code == 11000) {
                            return res.json("Tài khoản đã tồn tại!");
                        } else {
                            return res.json(err);
                        }
                    } else {
                        res.json("success");
                    }
                });
            }
        }
    });


    apiRouter.post("/login",parser,(req,res)=> {
        const emailorphone = req.body.EmailOrPhone.toString().trim().toLowerCase();
        const password = req.body.password;
        User.findOne({$or:[
            {email:emailorphone, isDelete:0},
            {numberPhone:emailorphone, isDelete:0}
        ]}).select("email firstName lastName numberPhone dob password role").exec(function(err,user){
            if (err){
                res.send(err);
            } else {
                if (!user){
                    res.json({err:1,message:"Không đúng Email/SDT hoặc password"});
                } else {
                    var validPassword = user.comparePassword(password);
                    if (!validPassword){
                        res.json({err:1,message:"Không đúng Email/SDT hoặc password"});
                    } else {
                        var token = jwt.sign({
                            name: user.lastName,
                            email: user.email
                        },superSecret,{
                            expiresIn: time_exprired
                        });
                        res.json({err:0,username:user.lastName,email:user.email,token:token,role:user.role,
                        fullname: user.lastName+" "+user.firstName});          
                    }
                }
            }
        });
    });

    apiRouter.use(function(req,res,next){
        var token = req.query.token || req.params.token;
        if (token){
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

    apiRouter.get("/",(req,res)=>{
        res.send({success:1});
    });
    app.get("/logout",(req,res)=>{
        res.render("dangnhap");
    });

    app.get("/redirect",function(req,res){
        res.render("auth");
    })
    //authen with facebook
    app.use(passport.initialize());
    app.use(passport.session());
    app.get("/auth/fb", passport.authenticate('facebook', { scope: ['email'] }));
    app.get("/auth/fb/cb",function(req,res,next){
        passport.authenticate('facebook',function(err,user,info){
            if (err){
                return next(err);
            };
            if (!user){
                return res.redirect("/login");
            };
            username = user.lastName;
            email = user.email;
            token = jwt.sign({
                name: user.lastName,
                email: user.email
            },superSecret,{
                expiresIn: time_exprired
            });
            return res.redirect("/redirect");
        })(req,res,next);
    });
    app.get("/success",function(req,res){
        res.json({username:username,email:email,token:token});
    })
    passport.use(new passportfb(
        {
            clientID: '910829922619157',
            clientSecret: '300b1e1b7435d99456cfe3c95e02f4ff',
            callbackURL: 'http://localhost:3000/auth/fb/cb',
            profileFields: ['email', 'gender', 'locale', 'displayName','first_name','last_name']
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ id: profile._json.id }, (err, user) => {
                console.log(profile);
                if (err) return done(err);
                if (user) return done(null, user);
                const newUser = {
                    id:profile._json.id,
                    email: profile._json.email,
                    firstName: profile._json.first_name,
                    lastName: profile._json.last_name,
                    numberPhone: "",
                    dob: "",
                    password:"12345678",
                    role:"user"
                }
                username = newUser.lastName;
                email = newUser.email;
                token = jwt.sign({
                    name: newUser.lastName,
                    email: newUser.email
                },superSecret,{
                    expiresIn: time_exprired
                });
                User.create(newUser, (err, user) => {
                    if (err) return done(err);
                    return done(null, newUser);
                })
            })
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findOne({ id }, (err, user) => {
            done(null, user);
        });
    });

    //authen with google
    app.get("/auth/google/callback",function(req,res,next){
        passport.authenticate('google',function(err,user,info){
            if (err || (!user)){
                return res.redirect("/login");
            };
            // if (!user){
            //     return res.redirect("/login");
            // };
            return res.redirect("/redirect");
        })(req,res,next);
    })
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            
        })
    );   
    passport.use(
        new GoogleStrategy(
            {
                clientID: '529498782265-of63hinvggfihtgmle4elacfheu0uitf.apps.googleusercontent.com',
                clientSecret: '5iMUHyS9iA45L0Es39JjbHsT',
                callbackURL: '/auth/google/callback'
            },
            (accessToken,refreshToken,profile,done) => {
                process.nextTick(function () {
                    User.findOne({ id: profile.id }, (err, user) => {
                        if (err) return done(err);
                        if (user) {
                            username = user.lastName;
                            email = user.email;
                            token = jwt.sign({
                                name: user.lastName,
                                email: user.email
                            },superSecret,{
                                expiresIn: time_exprired
                            });
                            return done(null, user);
                        }
                        const newUser = {
                            id: profile.id,
                            email: profile.emails[0].value,
                            firstName: profile.name.familyName,
                            lastName: profile.name.givenName,
                            numberPhone: "",
                            dateofBirth: "",
                            password:"12345678",
                            role:"user"
                        }
                        username = newUser.lastName;
                        email = newUser.email;
                        token = jwt.sign({
                            name: newUser.lastName,
                            email: newUser.email
                        },superSecret,{
                            expiresIn: time_exprired
                        });
                        User.create(newUser, (err, user) => {
                            if (err) return done(err);
                            return done(null, newUser);
                        });
                    })              
                });
            }
        )
    );
    
    passport.serializeUser((user,done) => {
        done(null,user.id);
    });
    
    passport.deserializeUser((id,done) => {
        User.findOne({ id }, (err, user) => {
            done(null, user);
        });
    });


    //handle Forgotpassword
    app.get("/forgotpsw",(req,res)=>{
        res.render("quenmatkhau");
    });

    app.post("/checkEmail",parser,(req,res)=>{
        var email = req.body.email;
        if (email[0]=="8"&&email[1]=="4"){
            email = email.replace("84","0");
        }
        User.find({$or:[{email:email},{numberPhone:email}]},function(err,data){
            if (err){
                throw err;
            } else {
                if (data.length==0){
                    res.json(0);
                } else {
                    res.json(1);
                }
            }
        })
    })
    const nexmo = new Nexmo({
        apiKey: "89d03306",
        apiSecret: "kP0cq3PjO49r8ht2"
      }, {debug:true});
    app.post("/sendCodeToEmail",parser,(req,res)=>{
        var email = req.body.email;
        if (email[0]=='0'|| email[0]=='8'){
            if (email[0]=="0"){
                email = email.replace("0","84");
            }
            let messageSend = randomInt(100000,999999);
            nexmo.message.sendSms("84969315430", email, "code = "+messageSend, { type: "unicode" },
                (err, responseData) => {
                    if (err) {
                        console.log(err);
                        res.json({ err: 1 });
                    } else {
                        console.log(responseData);
                        res.json(messageSend);
                    }
                }
            );
        } else {
            let numberRandom = randomInt(100000,999999);
            let txtTo = email;
            let txtSubject = "XÁC NHẬN ĐỔI MẬT KHẨU - SHOP BÁN GIÀY ONLINE";
            let txtContent = `<h3>Mã xác nhận để đổi mật khẩu của bạn là: ${numberRandom}</h3>`;
            sendmail(txtTo,txtSubject,txtContent);
            res.json(numberRandom);
        }
    });

    app.post("/resetPassword",parser,(req,res)=>{
        const newpass = req.body.newpass;
        const repass = req.body.repass;
        var err="";
        if (!newpass||!repass){
            err="Vui lòng nhập đầy đủ tất cả các trường"
            res.send({err:err,user:""});
        } else 
        if (newpass!=repass){
            err="Mật khẩu và xác nhận mật khẩu không khớp!";
            res.send({err:err,user:""});
        } else {
            const email = req.body.email;
            User.update({$or:[{email:email},{numberPhone:email}]},{$set:{password:newpass}},function(err,data){
                if (err){
                    throw err;
                } else {
                    res.send({err:""});
                }
            })
        }
    });

    app.post("/updateQvisit",parser,(req,res)=>{
        var email = req.body.email;
        User.findOneAndUpdate({email:email},{$inc:{qvisit:1}},function(err,data){
                    if (err) console.log(err); else
                    res.send("update success");
        });
    })
}