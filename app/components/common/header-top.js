import React from 'react'
import $ from 'jquery'
var main;
class OptionGuest extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		return(<nav>
			<ul className="list-inline">
				<li><a href="/signup">Đăng ký</a></li>
				<li><a href="/login">Đăng nhập</a></li>
			</ul>
		</nav>)
	}
}

class OptionUser extends React.Component {
	constructor(props){
		super(props);
		this.logOut = this.logOut.bind(this);
		this.state = {
			countmessage:0
		}
	}
	logOut(){
		localStorage.removeItem('username');
		localStorage.removeItem('email');
		localStorage.removeItem('token');
		window.location.replace("/");
	}
	componentDidMount(){
        var that=this;
        $.get("/getMessage",function(data){
            that.setState({countmessage:data.length});
        })
    }
	render() {
		return(<nav>
			<ul className="list-inline">
				<li className="inbox"><i className="fa fa-envelope-o" aria-hidden="true"></i><a href="/message">Tin nhắn<span>({this.state.countmessage})</span></a></li>
				<li><a href="/api/checkout">Thanh toán</a></li>
				<li><a href="/api/listfavorite">DS yêu thích</a></li>
				<li><a href="/api/manageaccount">Tài khoản</a></li>
				<li><a onClick={this.logOut} style={{cursor:'pointer'}}>Đăng xuất</a></li>
			</ul>
		</nav>)
	}
}
class WelcomeUser extends React.Component{
	render(){
		return(<div className="welcome-info" style={{cursor:'pointer'}}>
			Chào, <span>{localStorage.getItem("username")}</span>
		</div>)
	}
}
class HeaderTop extends React.Component {
	constructor(props) {
		super(props);
		this.logOut = this.logOut.bind(this);
		this.state = {
			Option: <OptionGuest/>,
			Welcome: ""
		}
		main = this;
	}
	componentDidMount(){
		var token = localStorage.getItem('token');
		var that = this;
		if (!token){
			localStorage.removeItem('username');
			localStorage.removeItem('email');
		} else {
			$.get("/api", { token: token }, function (data) {
				if (data.success == 0) {
					localStorage.removeItem('username');
					localStorage.removeItem('email');
					that.setState({ Option: <OptionGuest />, Welcome: "" })
				} else {
					that.setState({ Option: <OptionUser />, Welcome: <WelcomeUser /> })
				}
			})
		}
	}
	logOut(){
		localStorage.removeItem('username');
		localStorage.removeItem('email');
		localStorage.removeItem('token');
		that.setState({Option:<OptionGuest/>,Welcome:""});
	}
	render() {
		
		return (
			<div className="header-top">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<div className="header-left-menu">
								{this.state.Welcome}
								<ul className="languages-choose infor-toogle">
									<li>
										<a href="/orderhistory">
											<span>Lịch sử đơn hàng</span>
										</a>
									</li>
									<li>
										<a href="/manageaccount">
											<span>Quản lý tài khoản</span>
										</a>
									</li>
									<li>
										<a href="/message">
											<span>Tin nhắn</span>
										</a>
									</li>
									<li>
										<a onClick={this.logOut} style={{cursor:'pointer'}}>
											<span>Đăng xuất</span>
										</a>
									</li>
								</ul>
								<div className="currenty-converter">
									<form method="post" action="#" id="currency-set">
										<div className="current-currency">
											<span className="cur-label">Tiền tệ : </span><strong>VND</strong>
										</div>
									</form>
								</div>
								<div className="selected-language">
									<div className="current-lang">
										<span className="current-lang-label">Ngôn ngữ : </span><strong>Tiếng Việt</strong>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<div className="header-right-menu">
								{this.state.Option}
							</div>
						</div>
						<div id="login" className="modal fade" role="dialog">
							<div className="modal-dialog">

								<div className="modal-content">
									<div className="modal-body">
										<button data-dismiss="modal" className="close">&times;</button>
										<h4>Login</h4>
										<form>
											<input type="text" name="username" className="username form-control" placeholder="Username" />
											<input type="password" name="password" className="password form-control" placeholder="password" />
											<input className="btn login" type="submit" value="Login" />
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default HeaderTop;
