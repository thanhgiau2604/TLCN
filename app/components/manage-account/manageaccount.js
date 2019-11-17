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
class ManageAccountForm extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
			<section className="main-content-section">
			<div className="container">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="bstore-breadcrumb">
							<a href="/">Trang chủ</a>
							<span><i className="fa fa-caret-right"></i></span>
							<span>Quản lý tài khoản</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<h2 className="page-title text-center">Quản lý tài khoản</h2>
					</div>	
					<div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 col-lg-push-4">
						<div className="account-info">
							<div className="single-account-info">
								<ul>
									<li><a href="/personalinfor"><i className="fa fa-user"></i><span>Xem thông tin cá nhân</span>	</a></li>
									<li><a href="/changepassword"><i className="fa fa-pencil-square-o"></i><span>Đổi mật khẩu</span>	</a></li>
									<li><a href="/orderhistory"><i className="fa fa-list-ol"></i><span>Lịch sử mua hàng</span>	</a></li>
									<li><a href="/listfavorite"><i className="fa fa-heart"></i><span>Danh sách sản phẩm yêu thích</span></a></li>
									
									
								</ul>
							</div>
						</div>
					</div>										
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						
						<div className="home-link-menu">
							<ul>
								<li><a href="/"><i className="fa fa-chevron-left"></i> Trang chủ</a></li>
							</ul>
						</div>					
					</div>
				</div>
			</div>
		</section>)
    }
}

ReactDOM.render(
	<Provider store={store}>
		<HeaderTop />
		<HeaderMiddle />
		<MainMenu />
		<ManageAccountForm/>
		<CompanyFacality />
		<Footer />
		<CopyRight />
	</Provider>,document.getElementById("manage-account")
)

