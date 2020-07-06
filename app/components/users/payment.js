import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import $ from 'jquery'
var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'
import io from 'socket.io-client'
const socket = io('http://localhost:3000');

class Payment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            method:"",
            processing: false,
            err:false,
        }
    }
  componentDidMount(){
    var params = new URLSearchParams(window.location.search);
    var method= params.get("method");
    this.setState({method:method});
    if (method=="paypal"){
      
    } else 
    if (method=="vnpay"){
      var cr = params.get("coderesponse");
      if (cr=="00"){
        $.post("/updateOrderVnpay",{code:params.get("code")},function(data){
          console.log(data);
        })
      }
    } else 
    if (method=="stripe"){
      console.log("update stripe");
      $.post("/updateOrderStripe",{code:params.get("code"),chargeId:params.get("chargeid")},function(data){
        console.log(data);
      })
    } else 
    if (method=="zalopay"){

    }
  }

  backHomepage(){
    window.location.replace("/");
  }

    render(){
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
            <div class="row address">
              <h2 class="text-center">
                <b>THANH TOÁN THÀNH CÔNG!</b>
              </h2>
              <div class="alert alert-success text-center">
                <strong>Quý khách đã thanh toán thành công thông qua <i>{this.state.method}</i>!</strong>
              </div>
              <h3 class="text-center ordersuccess">
                Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.
                        </h3>
              <h3 class="text-center ordersuccess">
                Chân thành cảm ơn!
              </h3>
              <button class="btn btn-danger" onClick={this.backHomepage.bind(this)}>
                <i class="fa fa-home" aria-hidden="true"></i>
              Về trang chủ</button>
            </div>  
        </div>
    </section>)
    }
}

const Page = connect(function(state){  
})(Payment)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Page/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("payment")
)