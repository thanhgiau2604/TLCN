import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
class Success extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        socket.emit("require-update"," ");
    }
    render(){
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>Địa chỉ</span>
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
                <h3 class="text-center">XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG!</h3>
                <h3 class="text-center">Hãy vào Danh sách đơn hàng để theo dõi đơn hàng của quý khách.</h3>	
                <h3 class="text-center">Chân thành cảm ơn!</h3>		
            </div>
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