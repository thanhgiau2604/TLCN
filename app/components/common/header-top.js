import React from 'react'
import $ from 'jquery'
import UserChat from '../users/userchat'
var main;
class OptionGuest extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		return(<ul class="nav navbar-nav navbar-right">
		<li>
		  <a href="/signup">
		  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Đăng ký
		  </a>
		</li>
		<li>
		  <a href="login">
		   <i class="fa fa-sign-in" aria-hidden="true"></i> Đăng nhập
		  </a>
		</li> 
	</ul>)
	}
}

class OptionUser extends React.Component {
	constructor(props){
		super(props);
		this.logOut = this.logOut.bind(this);
		this.state = {
			countmessage:0
		}
		this.handleCheckout = this.handleCheckout.bind(this);
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
	handleCheckout(){
		window.location.assign("/checkout");
	}
	render() {
		return(<ul class="nav navbar-nav navbar-right">
		<li>
		  <a href="/message">
			<i class="fa fa-envelope" aria-hidden="true"></i> Tin nhắn
		  </a>
		</li>
		<li>
		  <a href="/orderhistory">
			<i class="fa fa-file-text" aria-hidden="true"></i> Đơn hàng
		  </a>
		</li>
		<li>
		  <a href="/listfavorite">
			<i class="fa fa-heart" aria-hidden="true"></i> Yêu thích
		  </a>
		</li>
		<li>
		  <a onClick={this.handleCheckout} style={{cursor:'pointer'}}>
			<i class="fa fa-shopping-cart" aria-hidden="true"></i> Thanh toán
		  </a>
		</li>
		<li class="dropdown">
		  <a
			href="#"
			class="dropdown-toggle"
			data-toggle="dropdown"
			role="button"
			aria-expanded="false"
		  >
			<i class="fa fa-user" aria-hidden="true"></i> Chào,
			 {localStorage.getItem("username")} <span class="caret"></span>
		  </a>
		  <ul class="dropdown-menu" role="menu">
			<li>
			  <a href="/manageaccount">
				<i class="fa fa-cog" aria-hidden="true"></i> Quản lý tài khoản
			  </a>
			</li>
			<li>
			  <a href="/changeaccount">
				<i class="fa fa-key" aria-hidden="true"></i> Đổi mật khẩu
			  </a>
			</li>
			<li>
			  <a onClick={this.logOut} style={{cursor:'pointer'}}>
				<i class="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất
			  </a>
			</li>
		  </ul>
		</li>
	  </ul>)
	}
}
class WelcomeUser extends React.Component{
	constructor(props){
		super(props);
		this.showOption = this.showOption.bind(this);
	}
	showOption(){
		$(".infor-toogle").slideToggle(400);
	}
	render(){
		return(<div className="welcome-info" style={{cursor:'pointer'}} onClick={this.showOption}>
			Chào, <span>{localStorage.getItem("username")}</span>
			<span><a>Sản phẩm yêu thích</a></span>
		</div>)
	}
}
class HeaderTop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Option: <OptionGuest/>,
			generateChat: false
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
					localStorage.removeItem("token");
					that.setState({ Option: <OptionGuest />})
				} else {
					that.setState({ Option: <OptionUser />,generateChat:true })
				}
			})
		}
	}
	render() {	
		return (
      <div class="example2">
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <button
                type="button"
                class="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            </div>
            <div id="navbar2" class="navbar-collapse collapse">
              {this.state.Option}
            </div>
          </div>
        </nav>
		{this.state.generateChat ? <UserChat/> : <div></div>}
      </div>
    );
	}
}
export default HeaderTop;
