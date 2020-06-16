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
const socket = io('http://localhost:3000');
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
            voucher: 0
        }
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
                var that = this;
                $.get("/check/"+code,function(data){
                  if (data.length!=0){
                    that.setState({type:"error",dataErr:data});
                  }
                  else {
                    $.get("/checkout/"+email+"/"+code,function(data){
                      $.post("/getListProductOrder", { code: code }, function (data) {
                        console.log()
                        var ship = data.sumshipcost;
                        that.setState({ listProductOrder: data.listproduct, type:"confirm", ship:ship, code:data.code,
                        voucher: data.costVoucher})
                      });
                    })         
                  }
                })
            }
        } else {
            this.setState({type:"payment"})
        }
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
                        <div class="text-center">
                          <h3 class="text-center ordersuccess">
                            Khách hàng có thể thanh toán thông qua Paypal tại
                            đây:
                          </h3>
                          {this.state.processing == true ? (
                            <div class="loader text-center"></div>
                          ) : (
                            <div></div>
                          )}
                          <img
                            src="/img/paypal-button.png"
                            class="ordersuccess"
                            width="15%"
                            onClick={this.paymentPaypal}
                            style={{ cursor: "pointer" }}
                          />
                          {this.state.err==true? <div class="alert alert-danger text-center">
                            <strong>
                              Có lỗi xảy ra. Hãy thử lại sau!
                            </strong>
                          </div> : <div></div>}
                        </div>
                        <h3 class="text-center ordersuccess">
                          Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của
                          quý khách.
                        </h3>
                        <h3 class="text-center ordersuccess">
                          Chân thành cảm ơn!
                        </h3>
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
                      <div class="alert alert-danger text-center">
                        <strong>LỖI ĐƠN HÀNG</strong>
                      </div>
                      <h3 class="text-center ordersuccess">
                        Chúng tôi lấy làm tiếc vì số lượng sản phẩm trong kho
                        không đủ để đáp ứng một số sản phẩm trong đơn hàng của
                        bạn.
                      </h3>
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