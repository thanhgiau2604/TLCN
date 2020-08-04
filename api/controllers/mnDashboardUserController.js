const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const User = require("../models/users");
const Message = require("../models/message");
const Statistic = require("../models/statistic");
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
process.env.CLIENT_EMAIL = "new-service-account@atlantean-house-272907.iam.gserviceaccount.com";
process.env.PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSKorDbnWvQdI8\nNVy5TNnJshbwvZD4+aWC9IwdGHb7eL61VUNGrCgHPIYF6EFVMR79zBU/kz29g3R0\nLpXo3eiLr0B5be/YB5tM5TfCI9uRr6TNmB2WC+mTx1FBP8cleTmZmP7UsQeU4b+Y\nOKRvnsB2A13GCPCWYrPwHh9VdI/v0/MXqDd2+aUURrgMBa9jEMX1yvjqAgPXZ/Ml\nIDHsRkv8XeYtSFpj3cJV2RSoi5Xg0RoKYgRHbkKIu2Xcr5/ZMOF+FMaJ2yM++Tzm\nuZO7xR359rLMUVIQvW9G/RxIub3IpeBUDdrxfXBaKE2b7FE5mFFWhP6t4E35rY+9\n9njqPs1pAgMBAAECggEAEHB+eOqUi+igR6tMyX6ORDQmhl8bzhTt+6Obmq4ku7Xh\n5S04ytsUCXRSMpnjtzw2Gx94CFV8LTN6xpJyw+UpgYRtgPrPbgG1AtoJAmncCS+z\nHniMY1Llq3xQdEFDGcDfrJnbl3ptut4FGY7NV8yIIv3P7zUUMiXZzRjmN0tL4RJO\n/3ZLQfPlgWay+dmnjjmbo0BvDK18AnGgQAXBSS//tRS9k0k/77EPpihN2Po854kF\nZWxjFBVXzmpZb4wPoFGJvff2tZaGy00XlM/QvATbyS2J7THeY2f9yYE+io8htWZY\n3i4crpuUOGPtYivMx1u8mzkJYI234PGLKMDBqMl47QKBgQDNJOXyjLsnwjv8PQMA\nOueuRoMxhFI3SqzUHbpnF5yma5ErsOpq6FeHOySOcaCHRbMr9xtUR3tmH7vnis0I\nzXuw6T17iJgYsJrn8qarVW2nEa9FSfK3DnZutBe/RuVHDrC1ClWeIg8KW2itx4le\nLunpMjZSscdMF9JhWNA3vy7w0wKBgQC2ZrbsB9RNRw9W92Fhd+5nA7VPHvTawc/m\nmo0qjO8TuofMybfhWWJXnFJgCSPhbd2KqRylWxolLepqxSOZkWFqzqSh0AFr8m58\nV2PPtkVpSqjpyPMPGqUmhGmDFC3Z7v1STpUqEMApFBpQZaie9ATaTZRsygNAPFCj\nC5T2M1LDUwKBgQCwmydrHESzAcBqcov20r9JhWLEakntV9hZ9A3ZWrZ9fvVHS9ND\nnipcPUpHZwLv8c1B+EYK1E8jqAY4W4IQJfZqYyGPDBUEjGWPcZKSxcTUo6DkYbkW\nZtkGjPw0q3APMFJoSTFUJbYVEISZtsJH1tOA8r1Zi7srgwaWz8LRe0GKCQKBgD6p\nzQALtIkT95YmCMOGg1XKtVhIR1B8MyODRyouHtiFRbA6QLzfi2ST5Mzvdu80Yl8H\nuDqqsLHDM3yY26Efi/s4oOCiaEqgkAqRr02lzfTdXGhsy+wNeF1iMimBHjt32nmT\nW7WG6a1zJZMnSaXKKXyiGHLDeBhyYDWTfgqTGUTXAoGBAMZ98jz14bJDfDZbg/M9\nBDgrfVvtUlpnUDuru7IwyVDum69b4TjC3Q2AUsJydIJvg0ke57js3g4NxNRxfSfL\nAgofpZ5XtAD7guJnlKca77Hkws6uxr5bFYvh14N/31IKZ+5sh7Ky/CHEngT7KZ1B\narVzNK5BDhtr8o/wFYHpshjS\n-----END PRIVATE KEY-----\n"
process.env.VIEW_ID = "208504637"
const jwtoken = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes);
function getUsers(res) {
    User.find({role:'user'}).sort({qorder:"descending"}).exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    })
}
function getCurrentDay() {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    if (month%10==month) month = '0'+month;
    if (day%10==day) day='0'+day;
    nowday = year.toString()+month.toString()+day.toString();
    return nowday;
}
module.exports = function(app,adminRouter,jwt){
    var superSecret = 'iamastudent';
    adminRouter.use(function(req,res,next){
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
    adminRouter.get("/",(req,res)=>{
        res.send({success:1});
    })
    app.get("/loginAdmin",(req,res)=>{
        res.render("dangnhapAdmin");
    })
    app.get("/dashboard",(req,res)=>{
        res.render("dashboard");
    });
    app.get("/manageuser",(req,res)=>{
        res.render("quanlyuser");
    });
    app.get("/getListUsers",(req,res)=>{
        User.find({role:'user'}).sort({qorder:"descending"}).exec(function(err,data){
            res.send(data);
        })
    });
    app.post("/deleteUser",parser,(req,res)=>{
        const id = req.body.id;
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
            role:'user',
            isDelete:0

        }
        User.create(user,function(err,data){
            if (err){
                throw err;
            } else {
                getUsers(res);
            }
        })
    })
    app.post("/importUser",parser,(req,res)=>{
        var users = JSON.parse(req.body.data);
        var arr=[];
        for(var i=0; i<users.length; i++){
            var user = users[i];
            if (user[0]=="firstName") continue;
            var obj = {
                firstName : user[0],
                lastName : user[1],
                email : user[2],
                numberPhone : user[3],
                dob : user[4],
                password : user[5],
                role : user[6],
                isDelete : user[7]
            }
            arr.push(obj);
        }
        User.insertMany(arr,function(err,data){
            if (err){
                res.json(0);
            } else {
                getUsers(res);
            }
        })
    })
    app.post("/restoreUser",parser,(req,res)=>{
        var id = req.body.id;
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
                                            // console.log(arrayResult.slice(0,10));
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
    app.post("/getMetrics",parser,(req,res)=>{
        async function getData() {
            const defaults = {
              'auth': jwtoken,
              'ids': 'ga:' + process.env.VIEW_ID,
            }
            const op = req.body.option;
            var startDate, endDate;
            var startDate1, endDate1;
            // console.log(op);
            switch (op) {
                case "today":
                    startDate= "today"; endDate= "today";
                    startDate1= "yesterday"; endDate1= "yesterday";
                    break;
                case "yesterday":
                    startDate= "yesterday"; endDate= "yesterday";
                    startDate1= "2daysAgo"; endDate1= "2daysAgo";
                    break;
                case "last7days":
                    startDate= "7daysAgo"; endDate= "yesterday";
                    startDate1= "14daysAgo"; endDate1= "8daysAgo";
                    break;
                case "last28days":
                    startDate= "28daysAgo"; endDate= "yesterday";
                    startDate1= "56daysAgo"; endDate1= "28daysAgo";
                    break;
            }
            console.log(startDate+" "+endDate);
            const response = await jwtoken.authorize()
            const result = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': startDate,
                'end-date': endDate,
                "metrics": "ga:users, ga:sessions, ga:bounceRate, ga:avgSessionDuration"
            });
            const result1 = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': startDate,
                'end-date': endDate,
                "metrics": "ga:users",
                "dimensions": "ga:date"
            })
            const result2 = await google.analytics('v3').data.ga.get({
                ...defaults,
                'start-date': startDate1,
                'end-date': endDate1,
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
    });

    app.post("/getMetricProduct",parser, (req,res)=>{
        var option = req.body.option;
        var d = new Date();
        var count;
        switch (option) {
            case "today":
                d.setDate(d.getDate());
                count = 0;
                break;
            case "yesterday":
                d.setDate(d.getDate()-1);
                count=1;
                break;
            case "last7days":
                count=7;
                d.setDate(d.getDate()-7);
                break;
            case "last28days":
                count=28;
                d.setDate(d.getDate()-28);
                break;
        }
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        var dayYesterday = yesterday.getDate(), monthYesterday = parseInt(yesterday.getMonth()+1);
        if (dayYesterday%10==dayYesterday) dayYesterday='0'+dayYesterday;
        if (monthYesterday%10==monthYesterday) monthYesterday='0'+monthYesterday;
        var dayThatDay = d.getDate(), monthThatDay = parseInt(d.getMonth()+1);
        if (dayThatDay%10==dayThatDay) dayThatDay='0'+dayThatDay;
        if (monthThatDay%10==monthThatDay) monthThatDay='0'+monthThatDay;
        var strYesterday = yesterday.getFullYear().toString()+monthYesterday.toString()+dayYesterday.toString();
        var strThatDay = d.getFullYear().toString()+monthThatDay.toString()+dayThatDay.toString();
        if (option=="today") strYesterday = strThatDay;
        // console.log(strThatDay+"-->" + strYesterday);
        Statistic.find({ day: { $gte: strThatDay, $lte: strYesterday } }, function (err, data) {
            if (err) console.log(err); else {
                var resultOrder = [], resultView = [];
                var arrIdOrder = [], arrIdView = [];
                (async () => {
                    for (var k = 0; k < data.length; k++) {
                        var dt = data[k];
                        for (var i = 0; i < dt.viewproduct.length; i++) {
                            var index = arrIdView.indexOf(dt.viewproduct[i].id.toString());
                            if (index != -1) {
                                resultView[index].view += dt.viewproduct[i].count;
                            } else {
                                arrIdView.push(dt.viewproduct[i].id.toString());
                                var result = await Product.findOne({ _id: dt.viewproduct[i].id });
                                resultView.push({
                                    product: result,
                                    view: dt.viewproduct[i].count
                                })
                            }
                        }
                        for (var i = 0; i < dt.orderproduct.length; i++) {
                            var index = arrIdOrder.indexOf(dt.orderproduct[i].id.toString());
                            if (index != -1) {
                                resultOrder[index].view += dt.orderproduct[i].count;
                            } else {
                                arrIdOrder.push(dt.orderproduct[i].id.toString());
                                var result = await Product.findOne({ _id: dt.orderproduct[i].id });
                                resultOrder.push({
                                    product: result,
                                    view: dt.orderproduct[i].count
                                })
                            }
                        }
                    }
                    res.json({view:resultView, order:resultOrder});
                })();
            }
        })
    })
    app.get("/getCloseCustomers",(req,res)=>{
        User.find({qorder:{$gte:1}},function(err,data){
            if (err){
                console.log(err);
            } else {
                res.send(data.sort((a,b)=>b.qorder-a.qorder));
            }
        })
    })
    app.get("/getVisitFrequently",(req,res)=>{
        User.find({qvisit:{$gte:15}},function(err,data){
            if (err){
                console.log(err);
            } else {
                res.send(data.sort((a,b)=>b.qvisit-a.qvisit));
            }
        })
    })
    app.get("/getNotOrder",(req,res)=>{
        User.find({$and: [{qvisit:{$gte:15}},{qorder:0}]},function(err,data){
            if (err){
                console.log(err);
            } else {
                res.send(data.sort((a,b)=>b.qvisit-a.qvisit));
            }
        })
    })
    //Thông kê sản phẩm bán chạy + không bán chạy dựa vào option truyền vào
    //Option = "Ascending" or "Descending"
    app.post("/getAllSellingProduct",parser,(req,res)=>{
        const optionSort = req.body.optionSort;
        const optionCategory = req.body.optionCategory;
        // console.log(optionCategory);
        if (optionCategory!="all"){
            ProductCategory.findOne({name:optionCategory},function(err,category){
                if (!err&&category){
                    var listPro = category.listProduct;
                    var arrResult = [];
                    var forLoop = async (_) => {
                      for (var i = 0; i < listPro.length; i++) {
                        var product = await Product.findOne({_id:listPro[i]._id},(err,pro)=>{});
                        if (product){
                            arrResult.push(product);
                        }
                      }
                      if (optionSort=="descending"){
                        res.send(arrResult.sort((a,b) => (a.orders < b.orders) ? 1 : ((b.orders < a.orders) ? -1 : 0))); 
                      } else 
                       if (optionSort=="ascending"){
                        res.send(arrResult.sort((a,b) => (a.orders > b.orders) ? 1 : ((b.orders > a.orders) ? -1 : 0)));
                      }
                    };
                    forLoop();
                }
            })
        } else {
            Product.find({}).sort({orders:optionSort}).exec(function(err,arrProduct){
                if (!err && arrProduct){
                    res.send(arrProduct);
                }
            })
        }
    })
    //Thống kê sản phẩm bán được trong một ngày cụ thể, truyền vào DATE
    app.post("/getSpecificDateSaleProduct",parser,(req,res)=>{
        const date = req.body.date.toString().replace(/-/g,"");
        const optionSort = req.body.optionSort;
        const optionCategory = req.body.optionCategory;
        /// xử lý date
        Statistic.findOne({day:date},(err,statistic)=>{
            if (!err && statistic){
                var arrResult = [];
                var loop = async _ => {
                    var category = await ProductCategory.findOne({name:optionCategory},(err,cate)=>{})
                    var listProduct;
                    // console.log(category);
                    if (category)  listProduct = category.listProduct;
                    // console.log(listProduct);
                    for (var i=0; i<statistic.orderproduct.length; i++){
                        var product = statistic.orderproduct[i];
                        if (optionCategory!='all' && listProduct){
                            var index = listProduct.findIndex(item => item._id.toString()==product.id.toString());
                            if (index==-1) continue;
                        }
                        var pro = await Product.findOne({_id:product.id},(err,dataProduct)=>{})
                        if (pro){
                            var result = {
                                name: pro.name,
                                image: pro.image,
                                costs: pro.costs,
                                orders: product.count
                            }
                            arrResult.push(result);
                        }
                    }
                    if (optionSort=="descending"){
                        res.send(arrResult.sort((a,b) => (a.orders < b.orders) ? 1 : ((b.orders < a.orders) ? -1 : 0))); 
                    } else 
                    if (optionSort=="ascending"){
                        res.send(arrResult.sort((a,b) => (a.orders > b.orders) ? 1 : ((b.orders > a.orders) ? -1 : 0)));
                    }
                }
                loop();
            } else {
                res.send([]);
            }
        })
    })
}