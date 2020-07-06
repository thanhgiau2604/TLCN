const router = require('express-promise-router')();
const ZaloPay = require('../../zalopay');
//const OrderRespository = require('../respository/OrderRepository');
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
router.post('/createorder', parser,async (req, res) => {
  const { ordertype } = req.query;
  const order = JSON.parse(req.body.order);
  console.log(order);
  console.log(ordertype);
  switch (ordertype) {
    case 'gateway':
      return res.send(await ZaloPay.Gateway(order));
    case 'quickpay':
      return res.send(await ZaloPay.QuickPay(order));
    default:
      return res.send(await ZaloPay.CreateOrder(order));
  }
});

router.post('/refund', async (req, res) => {
  res.send(await ZaloPay.Refund(req.body));
});

router.get('/getrefundstatus', async (req, res) => {
  const { mrefundid } = req.query;
  res.send(await ZaloPay.GetRefundStatus(mrefundid));
});

router.get('/getbanklist', async (req, res) => {
  res.send(await ZaloPay.GetBankList());
});

router.get('/gethistory', async (req, res) => {
  let { page } = req.query;
  page = Number(page);
  page = isNaN(page) ? 1 : page;

  //const orders = await OrderRespository.Paginate(page);
  res.send([]);
});

module.exports = router;