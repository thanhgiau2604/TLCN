import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import axios from "axios"
var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'
import io from 'socket.io-client'
import StripeCheckout from 'react-stripe-checkout'
const socket = io('http://localhost:3000');
var main,editOrder;

function formatCurrency(cost){
  return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
var codeOrder;
class ModalEditOrder extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      listValidProduct:[],
      listStatus: [],
      voucher: 0
    }
    this.changeProductPayment = this.changeProductPayment.bind(this);
    editOrder = this;
  }
  payment(){
    console.log("code="+codeOrder);
    var listProductOrder = [];
    var that = this;
    this.state.listStatus.map(function(item,index){
      if (item==true) listProductOrder.push(that.state.listValidProduct[index])
    });
    $.post("/updateWhenEditProduct",{code:codeOrder,listProduct:JSON.stringify(listProductOrder),
    voucher: this.state.voucher},function(data){
        window.location.replace(window.location.pathname);
    });
  }

  changeProductPayment(e,index){
    let listStatus = this.state.listStatus;
    if (this.refs['checkProduct'+index].checked==true){
      listStatus[index] = true;
    } else {
      listStatus[index] = false;
    }
    this.setState({listStatus:listStatus});
  }
  render(){
    var that = this;
    return(<div class="container">
    <div class="modal fade" id="modalEditPaymentProduct" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">THAY ĐỔI SẢN PHẨM THANH TOÁN</h4>
          </div>
          <div class="modal-body">        
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty">Vui lòng tick vào (các) sản phẩm cần thanh toán trong danh sách dưới đây:</label>
                  <table class='table'>
                    <thead>
                      <tr>
                        <th class="text-center">Chọn</th>
                        <th class="text-center">Tên sản phẩm</th>
                        <th class="text-center">Giá sản phẩm</th>
                        <th class="text-center">Kích thước</th>
                        <th class="text-center">Màu sắc</th>
                        <th class="text-center">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listValidProduct.map(function(product,index){
                        return(
                          <tr class='active' key={index}>
                            <td class="text-center">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id={"checkProduct"+index}
                                ref={"checkProduct"+index}
                                onChange={e => that.changeProductPayment(e,index)}/>
                            </div>
                            </td>
                            <td class="text-center">{product.name}</td>
                            <td class="text-center">{formatCurrency(product.cost)}</td>
                            <td class="text-center">{product.size}</td>
                            <td class="text-center">{product.color}</td>
                            <td class="text-center">{product.quanty}</td>
                          </tr>)
                      })}
                    </tbody>
                  </table>
                </div>  
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-success" data-dismiss="modal" onClick={this.payment.bind(this)}>Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  </div>)
  }
}
class Success extends React.Component {
    constructor(props){
        super(props);
        this.paymentPaypal = this.paymentPaypal.bind(this);
        this.state = {
            listProductOrder: [],
            ship: 0,
            code: 0,
            type: "confirm",
            processing: false,
            err:false,
            dataErr:[],
            voucher: 0,
            amount:0,
            stripeProduct: {name:"",price:0,productBy:""}
        }
        this.makePayment = this.makePayment.bind(this);
        main = this;
    }
  componentDidMount(){
        var url = window.location.pathname;
        if (url!="/ordersuccess"){
            var code = "", email = "", i, j;
            for (i = url.length - 1; i >= 0; i--) {
                if (url[i] != "/") code = url[i] + code; else break;
            }
            for (j = i - 1; j >= 0; j--) {
                if (url[j] != '/') email = url[j] + email; else break;
            }
            if (email=="confirmed"){
              this.setState({type:"confirmed"});
            } else {
                code = parseInt(code);
                codeOrder = code;
                var that = this;
                $.get("/check/"+code,function(data){
                  if (data.dataErr.length!=0){
                    that.setState({type:"error",dataErr:data.dataErr});
                    editOrder.setState({listValidProduct:data.dataValid,
                    listStatus: new Array(data.dataValid.length).fill(false),
                    voucher: data.voucher})
                  }
                  else {
                    $.post("/updateCart",{email1:email,email2:localStorage.getItem("email")},function(data){
                      $.get("/checkout/"+email+"/"+code,function(data){
                        console.log(data);
                        $.post("/getListProductOrder", { code: code }, function (data) {
                          var {dispatch} = main.props;
				                  dispatch({type:"UPDATE_PRODUCT",newcart:[]});
                          var ship = data.sumshipcost;
                          var amount=0;
                          data.listproduct.forEach(element => {
                            amount += element.cost*element.quanty;
                          });
                          amount = amount + ship;
                          if (data.costVoucher) amount -= data.costVoucher;
                          that.setState({ listProductOrder: data.listproduct, type:"confirm", ship:ship, code:data.code,
                          voucher: data.costVoucher,amount:amount,
                          stripeProduct:{name:"SHOES FROM SHOELG",price:amount,productBy:"SHOELG"}})
                        });
                      })         
                    })
                  }
                })
            }
        } else {
            this.setState({type:"payment"})
        }
  }
  vnPayment(){
      console.log(this.state.amount);
      $.post("/create_payment_url",{amount:this.state.amount},function(data){
          if (data.code=='00'){
              if (window.vnpay){
                  vnpay.open({width: 768, height: 600, url: data.data});
              } else {
                  location.href=data.data;
              }
          }
      })
  }
  stripePayment(){
      $(".StripeCheckout").click();
  }
  makePayment(token){
      var that = this;
      const body = {
          token,
          product: that.state.stripeProduct
      }
      $.post("/checkout/stripe",{data:JSON.stringify(body)},function(data){
          console.log(data);
      })
  }
  paymentPaypal(){
        var that = this;
        var email = localStorage.getItem("email");
        that.setState({err:false});
        this.setState({processing:true});
        $.post("/payment",{data:JSON.stringify(this.state.listProductOrder),ship:this.state.ship, code:this.state.code, email:email,
        voucher:this.state.voucher},function(data){
          if (data.err==true){
            that.setState({err:true,processing:false});
          } else {
            location.assign(data.link);
          }
        })
  }
  backHomepage(){
    window.location.replace("/");
  }
    render(){
        localStorage.removeItem("curorder");
        var that = this;
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>Thanh toán</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-todo first step-done">
                                <span><a href="/checkout">01. Tổng kết</a></span>
                            </li>                   
                           
                            <li class="step-todo second step-done">
                                <span>02. Địa chỉ</span>
                            </li>
                            <li class="step-todo third step-done">
                                <span>03. Xác nhận</span>
                            </li>
                            <li class="step-current last" id="step_end">
                                <span>04. Hoàn tất</span>
                            </li>
                        </ul>								
                    </div>
                </div> 
            </div>
            {(()=>{
                if (that.state.type=="confirm"){
                  socket.emit("require-update-order-product","");
                  socket.emit("require-update-quantity-product","")
                    return (
                      <div class="row address">
                        <h2 class="text-center">
                          <b>XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG!</b>
                        </h2>
                        <div class="col-xs-8 col-sm-8 col-md-6 col-lg-6 col-md-push-3 col-xs-push-1 col-sm-push-1 paymentOnline"
                        style={{ paddingTop: "10px" }}>
                          <h3><b>Bạn có thể thanh toán online bằng một trong các cổng bên dưới:</b></h3>
                          <div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                              <img src="../../img/paypal.png" width="160px" onClick={this.paymentPaypal.bind(this)}/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                              <img src="../../img/vnpay.png" width="120px" onClick={this.vnPayment.bind(this)} />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                              <img src="../../img/stripe.png" width="120px" onClick={this.stripePayment.bind(this)} />
                              <StripeCheckout
                                stripeKey="pk_test_51GxtcJBNzoYoLG3rT8ZmVb5TZvKsUAM1oQSKfhhy0QXFWyssByS7Y0tlXki8tMCulI08lQFLATuHbLrmeBny5o1G00ZdgAv63S"
                                token={this.makePayment}
                                name={this.state.stripeProduct.name}
                                amount={this.state.stripeProduct.price}
                                currency="vnd"
                                style={{ visibility: 'hidden' }}
                              />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                              <img src="../../img/zalopay.png" width="120px" />
                            </div>
                          </div>
                          <h3 class="text-center ordersuccess" style={{paddingTop:"15px"}}>
                          Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.</h3>
                        <h3 class="text-center ordersuccess">Chân thành cảm ơn!</h3>
                        </div>
                      </div>
                    );
                } else 
                if (that.state.type=="payment"){
                    return (
                      <div class="row address">
                        <h2 class="text-center">
                          <b>THANH TOÁN THÀNH CÔNG!</b>
                        </h2>
                        <div class="alert alert-success text-center">
                          <strong>Quý khách đã thanh toán thành công thông qua Paypal!</strong>
                        </div>
                        <h3 class="text-center ordersuccess">
                          Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.
                        </h3>
                        <h3 class="text-center ordersuccess">
                          Chân thành cảm ơn!
                        </h3>
                      </div>
                    );
                } else 
                if (that.state.type=="error"){
                  return (
                    <div class="row">
                      <h2 class="text-center ordersuccess">
                        <b>THÔNG BÁO</b>
                      </h2>
                      <div class="alert alert-danger text-center">
                        <h4>
                        <strong>Chúng tôi lấy làm tiếc vì số lượng sản phẩm trong kho không đủ để đáp ứng một số sản phẩm trong đơn hàng của bạn.</strong>
                        </h4>
                      </div>
                      <h4>Danh sách sản phẩm:</h4>
                      <table className="table table-hover text-center">
                        <thead>
                          <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Tên sản phẩm</th>
                            <th className="text-center">Số lượng</th>
                            <th className="text-center">Kích cỡ</th>
                            <th className="text-center">Màu sắc</th>
                            <th className="text-center">Giá sản phẩm</th>
                          </tr>
                        </thead>
                        <tbody>
                          {that.state.dataErr.map(function(product,index){
                            var cost = product.cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                            return(<tr className="text-center" key={index}>
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{product.name}</td>
                            <td className="text-center">{product.quanty}</td>
                            <td className="text-center">{product.size}</td>
                            <td className="text-center">{product.color}</td>
                            <td className="text-center">{cost}</td>
                            </tr>)
                          })}
                        </tbody>
                      </table>
                      
                      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 continue-payment col-md-push-1">
                        <h3><b>Hiện tại trong đơn hàng có {editOrder.state.listValidProduct.length} sản phẩm hợp lệ.</b></h3>
                        <ul style={{listStyleType:"square"}}>
                          <li>
                            <h4>Nếu muốn tiếp tục thanh toán các sản phẩm hợp lệ trong đơn hàng, click vào đây:
                              <button class="btn btn-danger">
                              <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>Tiếp tục thanh toán</button>
                            </h4>
                          </li>
                          <li>
                            <h4>Nếu lựa chọn lại các sản phẩm cần thanh toán, click vào đây:
                                <button class="btn btn-warning" title='Thay đổi sản phẩm thanh toán' data-toggle="modal"
                                data-target="#modalEditPaymentProduct">
                                  <i class="fa fa-pencil" aria-hidden="true"></i>Chỉnh sửa</button>
                            </h4>
                          </li>
                          <li>
                            <h4>Nếu không muốn thanh toán và quay về trang chủ, click vào đây:
                                <button class="btn btn-primary" onClick={this.backHomepage.bind(this)}>
                                <i class="fa fa-reply-all" aria-hidden="true"></i>Về trang chủ</button>
                            </h4>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                } else {
                    return (
                      <div class="row address">
                        <div class="alert alert-danger text-center">
                          <strong>
                            QÚY KHÁCH ĐÃ XÁC NHẬN ĐƠN HÀNG NÀY RỒI!
                          </strong>
                        </div>
                        <h3 class="text-center ordersuccess">
                          Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.
                        </h3>
                        <h3 class="text-center ordersuccess">
                          Chân thành cảm ơn!
                        </h3>
                      </div>
                    );
                }
            })()}
        </div>
        <ModalEditOrder/>
    </section>)
    }
}


const Page = connect(function(state){  
})(Success)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Page/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("ordersuccess")
)