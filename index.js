const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT|| 3000;
const authenController = require('./api/controllers/authenController');
const homeController = require("./api/controllers/homeController");
const personalController = require("./api/controllers/personalController");
const adminController = require("./api/controllers/adminController");
const productController = require("./api/controllers/productController");
const categoryProductController = require("./api/controllers/categoryProductController");
const manageProductController = require("./api/controllers/manageProductController");
const manageCategoryController = require("./api/controllers/manageCategoryController");
const checkoutController = require("./api/controllers/checkoutController");
app.set("view engine","ejs");
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization,x-access-token');
  next();
});

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/shoelg",{useNewUrlParser:true});
mongoose.set('useCreateIndex',true);
authenController(app);
homeController(app);
personalController(app);
adminController(app);
productController(app);
categoryProductController(app);
manageProductController(app);
manageCategoryController(app);
checkoutController(app);
app.use("/", express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/public"));
app.get("/login",(req,res)=> res.render("dangnhap"));
app.get("/signup",(req,res)=> res.render("dangky"));
app.get("/manageaccount",(req,res)=>res.render("quanlytaikhoan"));
app.get("/personalinfor",(req,res)=> res.render("thongtincanhan"));
app.listen(PORT, ()=> console.log("App listening on PORT "+PORT));
