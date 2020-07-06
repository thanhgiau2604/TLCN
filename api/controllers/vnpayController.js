const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({ extended: false });
var Order = require("../models/order");
function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}
module.exports = function (app) {
  // app.get("/", function (req, res, next) {
  //   res.render("orderlist", { title: "Danh sách đơn hàng" });
  // });

  app.get("/create_payment_url", function (req, res, next) {
    var dateFormat = require("dateformat");
    var date = new Date();
    var desc =
      "Thanh toan don hang thoi gian: " +
      dateFormat(date, "yyyy-mm-dd HH:mm:ss");
    res.render("order", {
      title: "Tạo mới đơn hàng",
      amount: 10000,
      description: desc,
    });
  });

  app.post("/create_payment_url", parser, function (req, res, next) {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var config = require("config");
    var dateFormat = require("dateformat");
    console.log(req.body.code);
    var tmnCode = config.get("vnp_TmnCode");
    var secretKey = config.get("vnp_HashSecret");
    var vnpUrl = config.get("vnp_Url");
    var returnUrl = config.get("vnp_ReturnUrl")+"/"+req.body.code;

    var date = new Date();
    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = dateFormat(date, "HHmmss");
    var amount = req.body.amount;
    var bankCode = null;

    var orderInfo = "Mua giay Online - SHOELG";
    var orderType = "fashion";
    var locale = "vn";
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var secureHash = sha256(signData);

    vnp_Params["vnp_SecureHashType"] = "SHA256";
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });

    //Neu muon dung Redirect thi dong dong ben duoi
    res.json({ code: "00", data: vnpUrl });
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
    //res.redirect(vnpUrl)
  });

  app.get("/vnpay_return/:code", function (req, res, next) {
    var vnp_Params = req.query;
    var code = req.params.code;
    console.log("return "+req.params.code);
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var config = require("config");
    var tmnCode = config.get("vnp_TmnCode");
    var secretKey = config.get("vnp_HashSecret");

    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
       res.redirect("/payment?method=vnpay&coderesponse="+vnp_Params["vnp_ResponseCode"]+"&code="+code);
    } else {
      res.redirect("/payment?method=vnpay&coderesponse="+'97');
    }
  });
  app.post("/updateOrderVnpay",parser,(req,res)=>{
    const code = req.body.code;
    Order.findOneAndUpdate({code:code},{$set:{payment:true,paymentMethod:"vnpay"}},function(err,data){
      if (!err && data){
        res.json({ok:1});
      }
    });
  }) 
  // app.get("/success?code=:code", (req, res) => {
  //   res.render("success");
  // });
  // app.get("/success", (req, res) => {
  //   res.render("success");
  // });
  app.get("/vnpay_ipn", function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var config = require("config");
    var secretKey = config.get("vnp_HashSecret");
    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  });
};
