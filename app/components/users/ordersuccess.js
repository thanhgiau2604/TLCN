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
class Success extends React.Component {
    constructor(props){
        super(props);
        this.paymentPaypal = this.paymentPaypal.bind(this);
        this.state = {
            listProductOrder: [],
            ship: 0,
            code: 0,
            type: "confirm"
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
            code = parseInt(code);
            var that = this;
            $.post("/getListProductOrder", { code: code }, function (data) {
                var ship = data.sumshipcost;
                that.setState({ listProductOrder: data.listproduct, type:"confirm", ship:ship, code:data.code})
            })
        } else {
            this.setState({type:"payment"})
        }
    }
    paymentPaypal(){
        $.post("/payment",{data:JSON.stringify(this.state.listProductOrder),ship:this.state.ship, code:this.state.code},function(data){
            location.assign(data);
        })
    }
    render(){
        localStorage.removeItem("curorder");
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
            {this.state.type=="confirm" ? 
            <div class="row address">
                <h2 class="text-center"><b>XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG!</b></h2>
                <div class="text-center">
                    <h3 class="text-center ordersuccess">Khách hàng có thể thanh toán thông qua Paypal tại đây:</h3>
                    <img src="/img/paypal-button.png" class="ordersuccess" width="15%" onClick={this.paymentPaypal} style={{cursor:"pointer"}}/>
                </div>
                <h3 class="text-center ordersuccess">Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.</h3>	
                <h3 class="text-center ordersuccess">Chân thành cảm ơn!</h3>		
            </div>
            : <div class="row address">
                <h2 class="text-center"><b>THANH TOÁN THÀNH CÔNG!</b></h2>
                <div class="text-center">
                    <h3 class="text-center ordersuccess">Quý khách đã thanh toán thành công thông qua Paypal</h3>
                </div>
                <h3 class="text-center ordersuccess">Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.</h3>	
                <h3 class="text-center ordersuccess">Chân thành cảm ơn!</h3>	
            </div>
            }
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