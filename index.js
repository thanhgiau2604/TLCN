const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
const mangeOrderController = require("./api/controllers/manageOrderController");
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
var apiRouter = express.Router();
var adminRouter = express.Router();
app.use("/api",apiRouter);
app.use("/admin",adminRouter);
authenController(app,apiRouter,jwt);
homeController(app,apiRouter);
personalController(app,apiRouter);
adminController(app,adminRouter,jwt);
productController(app);
categoryProductController(app);
manageProductController(app,adminController);
manageCategoryController(app,adminController);
checkoutController(app,apiRouter);
mangeOrderController(app);
app.use("/", express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/public"));
app.get("/login",(req,res)=> res.render("dangnhap"));
app.get("/signup",(req,res)=> res.render("dangky"));
app.listen(PORT, ()=> console.log("App listening on PORT "+PORT));
