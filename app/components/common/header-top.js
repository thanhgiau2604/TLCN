import React from 'react'

class OptionGuest extends React.Component {
	render() {
		return(<nav>
			<ul className="list-inline">
				<li><a href="cart.html">Thanh toán</a></li>
				<li><a href="/listfavorite">DS yêu thích</a></li>
				<li><a href="/manageaccount">Tài khoản</a></li>
				<li><a href="cart.html">Giỏ hàng</a></li>
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
	}
	logOut(){
		localStorage.removeItem('username');
		window.location.assign("/");
	}
	render() {
		return(<nav>
			<ul className="list-inline">
				<li className="inbox"><i className="fa fa-envelope-o" aria-hidden="true"></i><a href="/message">Tin nhắn<span>(5)</span></a></li>
				<li><a href="cart.html">Thanh toán</a></li>
				<li><a href="/listfavorite">DS yêu thích</a></li>
				<li><a href="/manageaccount">Tài khoản</a></li>
				<li><a href="cart.html">Giỏ hàng</a></li>
				<li><a onClick={this.logOut} style={{cursor:'pointer'}}>Đăng xuất</a></li>
			</ul>
		</nav>)
	}
}
class WelcomeUser extends React.Component{
	render(){
		return(<div className="welcome-info">
			Chào, <span>{localStorage.getItem("username")}</span>
		</div>)
	}
}
class HeaderTop extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var username = localStorage.getItem("username");
		console.log(username);
		var Option="",Welcome="";
		if (!username) {
			Option = <OptionGuest/>;
		} else {
			Option = <OptionUser/>;
			Welcome = <WelcomeUser/>;
		}
		return (
			<div className="header-top">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<div className="header-left-menu">
								{Welcome}
								<ul className="languages-choose infor-toogle">
									<li>
										<a href="/orderhistory">
											<span>Lịch sử đơn hàng</span>
										</a>
									</li>
									<li>
										<a href="my-account.html">
											<span>Quản lý tài khoản</span>
										</a>
									</li>
									<li>
										<a href="list-message.html">
											<span>Tin nhắn</span>
										</a>
									</li>
									<li>
										<a href="index-2.html">
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
								{Option}
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
