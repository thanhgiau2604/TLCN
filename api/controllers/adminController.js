const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const Admin = require("../models/admin");
const User = require("../models/users");
const Message = require("../models/message");
var Statistic = require("../models/statistic");
const Product = require("../models/Product");
const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
process.env.CLIENT_EMAIL = "new-service-account@atlantean-house-272907.iam.gserviceaccount.com";
process.env.PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSKorDbnWvQdI8\nNVy5TNnJshbwvZD4+aWC9IwdGHb7eL61VUNGrCgHPIYF6EFVMR79zBU/kz29g3R0\nLpXo3eiLr0B5be/YB5tM5TfCI9uRr6TNmB2WC+mTx1FBP8cleTmZmP7UsQeU4b+Y\nOKRvnsB2A13GCPCWYrPwHh9VdI/v0/MXqDd2+aUURrgMBa9jEMX1yvjqAgPXZ/Ml\nIDHsRkv8XeYtSFpj3cJV2RSoi5Xg0RoKYgRHbkKIu2Xcr5/ZMOF+FMaJ2yM++Tzm\nuZO7xR359rLMUVIQvW9G/RxIub3IpeBUDdrxfXBaKE2b7FE5mFFWhP6t4E35rY+9\n9njqPs1pAgMBAAECggEAEHB+eOqUi+igR6tMyX6ORDQmhl8bzhTt+6Obmq4ku7Xh\n5S04ytsUCXRSMpnjtzw2Gx94CFV8LTN6xpJyw+UpgYRtgPrPbgG1AtoJAmncCS+z\nHniMY1Llq3xQdEFDGcDfrJnbl3ptut4FGY7NV8yIIv3P7zUUMiXZzRjmN0tL4RJO\n/3ZLQfPlgWay+dmnjjmbo0BvDK18AnGgQAXBSS//tRS9k0k/77EPpihN2Po854kF\nZWxjFBVXzmpZb4wPoFGJvff2tZaGy00XlM/QvATbyS2J7THeY2f9yYE+io8htWZY\n3i4crpuUOGPtYivMx1u8mzkJYI234PGLKMDBqMl47QKBgQDNJOXyjLsnwjv8PQMA\nOueuRoMxhFI3SqzUHbpnF5yma5ErsOpq6FeHOySOcaCHRbMr9xtUR3tmH7vnis0I\nzXuw6T17iJgYsJrn8qarVW2nEa9FSfK3DnZutBe/RuVHDrC1ClWeIg8KW2itx4le\nLunpMjZSscdMF9JhWNA3vy7w0wKBgQC2ZrbsB9RNRw9W92Fhd+5nA7VPHvTawc/m\nmo0qjO8TuofMybfhWWJXnFJgCSPhbd2KqRylWxolLepqxSOZkWFqzqSh0AFr8m58\nV2PPtkVpSqjpyPMPGqUmhGmDFC3Z7v1STpUqEMApFBpQZaie9ATaTZRsygNAPFCj\nC5T2M1LDUwKBgQCwmydrHESzAcBqcov20r9JhWLEakntV9hZ9A3ZWrZ9fvVHS9ND\nnipcPUpHZwLv8c1B+EYK1E8jqAY4W4IQJfZqYyGPDBUEjGWPcZKSxcTUo6DkYbkW\nZtkGjPw0q3APMFJoSTFUJbYVEISZtsJH1tOA8r1Zi7srgwaWz8LRe0GKCQKBgD6p\nzQALtIkT95YmCMOGg1XKtVhIR1B8MyODRyouHtiFRbA6QLzfi2ST5Mzvdu80Yl8H\nuDqqsLHDM3yY26Efi/s4oOCiaEqgkAqRr02lzfTdXGhsy+wNeF1iMimBHjt32nmT\nW7WG6a1zJZMnSaXKKXyiGHLDeBhyYDWTfgqTGUTXAoGBAMZ98jz14bJDfDZbg/M9\nBDgrfVvtUlpnUDuru7IwyVDum69b4TjC3Q2AUsJydIJvg0ke57js3g4NxNRxfSfL\nAgofpZ5XtAD7guJnlKca77Hkws6uxr5bFYvh14N/31IKZ+5sh7Ky/CHEngT7KZ1B\narVzNK5BDhtr8o/wFYHpshjS\n-----END PRIVATE KEY-----\n"
process.env.VIEW_ID = "208504637"
const jwtoken = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes);
function getUsers(res) {
    User.find({role:'user'},function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data);
        }
    })
}
function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    nowday = day.toString()+month.toString()+year.toString();
    return nowday;
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
        // User.remove({_id:id},function(err,data){
        //     getUsers(res);
        // })
        User.update({_id:id},{$set:{isDelete:1}},function(err,data){
            if (err){
                throw err;
            } else {
                getUsers(res);
            }
        })
    });
    app.post("/updateUser",parser,(req,res)=>{
        const id = req.body.id;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const dob = req.body.dob;
        const password = req.body.password;
        console.log(password);
        if (password==""){
            User.update({_id:id},{$set:{firstName:firstname, lastName:lastname, email:email, 
                numberPhone:phone, dob:dob}},function(err,data){
                    getUsers(res);
            })
        } else {
            User.update({_id:id},{$set:{firstName:firstname, lastName:lastname, email:email, 
                numberPhone:phone, dob:dob, password:password}},function(err,data){
                    getUsers(res);
            })
        }
        
    });
    app.post("/addUser",parser,(req,res)=>{
        var user = {
            firstName:  req.body.firstname,
            lastName: req.body.lastname,
            email:req.body.email,
            numberPhone: req.body.phone,
            dob: req.body.dob,
            password: req.body.password,
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
    app.post("/restoreUser",parser,(req,res)=>{
        var id = req.body.id;
        console.log(id);
        User.update({_id:id},{$set:{isDelete:0}},function(err,data){
            if (err) {
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
        var status =req.body.status;
        var deleted = -1;
        if (status=="2") {
            deleted = 0;
        } else if (status=="3") {
            deleted=1;
        }
        if (deleted==-1) {
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
        } else {
            User.find({$or:[
                {firstName:{$regex : ".*"+keysearch+".*",'$options' : 'i' },isDelete:deleted},
                {lastName: {$regex : ".*"+keysearch+".*",'$options' : 'i' },isDelete:deleted},
                {email:{$regex : ".*"+keysearch+".*",'$options' : 'i' },isDelete:deleted},
                {numberPhone:{$regex : ".*"+keysearch+".*",'$options' : 'i' },isDelete:deleted}
            ]},function(err,data){
                if (err){
                    throw err;
                } else {
                    res.send(data);
                }
            })
        }    
    });
    //manage message
    app.get("/manageMessage",(req,res)=>{
        res.render("quanlytinnhan");
    });
    app.get("/getListMessage",(req,res)=>{
        Message.find({},function(err,data){
            if (err){
                throw err;
            } else {
                res.send(data);
            }
        })
    });
    app.post("/addMessage",parser,(req,res)=>{
        const content = req.body.content;
        const email = req.body.email;
        var message = {
            index: parseInt(Date.now().toString),
            content: content,
            datetime: new Date().toLocaleString(),
            sender: email
        }
        Message.create(message,function(err,data){
            if (err){
                throw err;
            } else {
                Message.find({},function(err,data){
                    if (err){
                        throw err;
                    } else {
                        res.send(data);
                    }
                })
            }
        })
    });
    app.post("/deleteMessage",parser,(req,res)=>{
        const id = req.body.id;
        Message.remove({_id:id},function(err,data){
            if (err){
                throw err;
            } else {
                Message.find({},function(err,data){
                    if (err){
                        throw err;
                    } else {
                        res.send(data);
                    }
                })
            }
        })
    });
    app.get("/topview",(req,res)=>{
        var day = getCurrentDay();
        Statistic.findOne({day:day},function(err,data){
            if (err) console.log(err);
            if (data){
                if (data.viewproduct.length==0) {
                    res.send([]);
                } else {
                    var list = data.viewproduct;
 
                    for (var i = 0; i < list.length - 1; i++) {
                        for (var j = i + 1; j < list.length; j++) {
                            if (list[i].count < list[j].count) {
                                var tmp = list[i];
                                list[i] = list[j];
                                list[j] = tmp;
                            }
                        }
                    }

                    var arrayResult = [];
                    var count = 0;
                    var forLoop = async _ => {
                        for (var i = 0; i < list.length; i++) {
                            await Product.findOne({ _id: list[i].id }, function (err, pro) {
                                count++;
                                if (pro) {
                                    if (list[i]){
                                        var item = {
                                            product: pro,
                                            view: list[i].count
                                        }
                                        arrayResult.push(item);
                                        if (count == list.length) {
                                            console.log(arrayResult.slice(0,10));
                                            return res.send(arrayResult.slice(0,10));
                                        }
                                    }    
                                }
                            })
                        }
                    }
                    forLoop();
                }
            } else {
                res.send([]);
            }
        })
    });
    app.get("/toporder",(req,res)=>{
        var day = getCurrentDay();
        Statistic.findOne({day:day},function(err,data){
            if (err) console.log(err);
            if (data){
                if (data.orderproduct.length==0){
                    res.send([]);
                } else {
                    var list = data.orderproduct;
                    for (var i = 0; i < list.length - 1; i++) {
                        for (var j = i + 1; j < list.length; j++) {
                            if (list[i].count < list[j].count) {
                                var tmp = list[i];
                                list[i] = list[j];
                                list[j] = tmp;
                            }
                        }
                    }
                    var arrayResult = [];
                    var count = 0;
                    var forLoop1 = async _ => {
                        for (var i = 0; i < list.length; i++) {
                            await Product.findOne({ _id: list[i].id }, function (err, pro) {
                                count++;
                                if (pro) {
                                    if (list[i]) {
                                        var item = {
                                            product: pro,
                                            view: list[i].count
                                        }
                                        arrayResult.push(item);
                                        if (count == list.length) {
                                            return res.send(arrayResult.slice(0,10));
                                        }
                                    }
                                }
                            })
                        }
                    }
                    forLoop1();
                }
            } else {
                res.send([]);
            }
        })
    });
    app.get("/getMetrics",(req,res)=>{
        async function getData() {
            const defaults = {
              'auth': jwtoken,
              'ids': 'ga:' + process.env.VIEW_ID,
            }
            const response = await jwtoken.authorize()
            const result = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': '7daysAgo',
                'end-date': 'yesterday',
                "metrics": "ga:users, ga:sessions, ga:bounceRate, ga:avgSessionDuration"
            });
            const result1 = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': '7daysAgo',
                'end-date': 'yesterday',
                "metrics": "ga:users",
                "dimensions": "ga:date"
            })
            const result2 = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': '14daysAgo',
                'end-date': '8daysAgo',
                "metrics": "ga:users",
                "dimensions": "ga:date"
            })
            const result3 = await google.analytics('v3').data.realtime.get({
                ...defaults,
                "metrics": "rt:activeUsers"
            })
            var arrMetrics = [0,0,0,0];
            if (result.data.rows) {
                arrMetrics = [result.data.rows[0][0],result.data.rows[0][1]];
                arrMetrics.push(parseFloat(result.data.rows[0][2]).toFixed(2));
                arrMetrics.push(parseFloat(result.data.rows[0][3]).toFixed(2));
            }
            var arrUsers = [];
            if (result1.data.rows){
                arrUsers = result1.data.rows;
            }
            var arrUserBefore = [];
            if (result2.data.rows){
                arrUserBefore = result2.data.rows;
            }
            var user = 0;
            if (result3.data.rows){
                user = result3.data.rows[0][0];
            }
            res.json({metrics:arrMetrics, users: arrUsers, usersBefore: arrUserBefore, countUser:user});
        }
        getData();
    })
}