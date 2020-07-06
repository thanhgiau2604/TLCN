const express = require("express");
const cors = require('cors')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const enableWS = require('express-ws');
const ZaloPay = require('./zalopay');
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const PORT = process.env.PORT|| 3000;
const authenController = require('./api/controllers/authenController');
const homeController = require("./api/controllers/homeController");
const personalController = require("./api/controllers/personalController");
const mnDashboardUserController = require("./api/controllers/mnDashboardUserController");
const productController = require("./api/controllers/productController");
const categoryProductController = require("./api/controllers/categoryProductController");
const manageProductController = require("./api/controllers/manageProductController");
const manageCategoryController = require("./api/controllers/manageCategoryController");
const checkoutController = require("./api/controllers/checkoutController");
const mangeOrderController = require("./api/controllers/manageOrderController");
const socketIOController = require("./api/controllers/socketIOController");
const paypalController = require('./api/controllers/paypalController');
const chatController = require('./api/controllers/chatController');
const stripeController = require("./api/controllers/stripeController");
const vnpayController = require("./api/controllers/vnpayController");
app.set("view engine","ejs");

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,FETCH');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization,x-access-token');
  next();
});
app.use(cors());
//set up database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/shoelg",{useNewUrlParser:true});
mongoose.set('useCreateIndex',true);
//set up router
var apiRouter = express.Router();
var adminRouter = express.Router();
app.use("/api",apiRouter);
app.use("/admin",adminRouter);
app.use('/zalo', require('./api/controllers/zalopayController'));
//set up controllers
socketIOController(app,io);
authenController(app,apiRouter,jwt);
homeController(app,apiRouter);
personalController(app,apiRouter);
mnDashboardUserController(app,adminRouter,jwt);
productController(app);
categoryProductController(app);
manageProductController(app,io);
manageCategoryController(app);
checkoutController(app,io);
mangeOrderController(app);
paypalController(app);
chatController(app,io);
stripeController(app);
vnpayController(app);
app.use("/", express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/public"));
app.get("/login",(req,res)=> res.render("dangnhap"));
app.get("/signup",(req,res)=> res.render("dangky"));
enableWS(app);

//api zalopay
const hub = new Map();
app.get("/zalohome",(req,res)=>{
  res.render("zalohome");
})
app.ws('/subscribe', parser,(ws, req) => {
  const { apptransid } = req.query;
  hub.set(apptransid, ws);
  ws.on('close', () => {
    hub.delete(apptransid);
  });
});

app.post('/callback', parser,(req, res) => {
  const { data: dataStr, mac } = req.body;
  const result = ZaloPay.VerifyCallback(dataStr, mac);

  if (result.returncode !== -1) {
    const data = JSON.parse(dataStr);
    const { apptransid } = data;
    hub.get(apptransid).send(dataStr);
    //OrderRespository.SaveOrder(data);
  }

  res.send(result);
});
//run server
server.listen(PORT, ()=> console.log("App listening on PORT "+PORT));
