import React from 'react'
import $ from 'jquery'
class LoginForm extends React.Component{
    constructor(props){
		super(props);
		this.state = {
			error : ""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e){
		const EmailOrPhone = this.emailsdt.value;
		const password = this.password.value;
		console.log(EmailOrPhone);
		console.log(password);
		var form = this;
		$.post("/api/login",{EmailOrPhone:EmailOrPhone, password:password},function(data){			
			if (data.err==1){
				form.setState({error:data.message});
			} else {
				if (data.role=='user'){
					console.log(data);
					localStorage.setItem("username", data.username);
					localStorage.setItem("email", data.email);
					localStorage.setItem('token', data.token);
					window.location.replace("/");
				} else {
					localStorage.setItem("usernamead", data.username);
					localStorage.setItem("emailad", data.email);
					localStorage.setItem('tokenad', data.token);
					window.location.replace("/dashboard");
				}
			}
		})		
		e.preventDefault();
	}
	// handleFacebook(){
	// 	$.get("/auth/fb",function(data){
	// 		console.log(data);
	// 	})
	// }
    render(){
        return(
			<section className="main-content-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="bstore-breadcrumb">
								<a href="/">Trang chủ</a>
								<span><i className="fa fa-caret-right"></i></span>
								<span>Đăng nhập</span>
							</div>
						</div>
					</div>
					<div className="login container">
						<form onSubmit={this.handleSubmit}>
							<div className="row">
								<h2><b>ĐĂNG NHẬP</b></h2>
								<div className="vl">
									<span className="vl-innertext">hoặc</span>
								</div>

								<div className="col">
									<a href="/auth/fb" className="fb btn">
										<i className="fa fa-facebook fa-fw"></i> Đăng nhập với Facebook
								</a>
									<a href="/auth/google" className="google btn"><i className="fa fa-google fa-fw">
									</i> Đăng nhập với Google+
								</a>
								</div>

								<div className="col">
									<div className="hide-md-lg">
										<p>Or sign in manually:</p>
									</div>

									<input type="text" name="emailsdt" placeholder="Email/Số điện thoại" required ref={(data) => { this.emailsdt = data; }}/>
									<input type="password" name="password" placeholder="Mật khẩu" required ref={(data) => { this.password = data; }}/>
									<input type="submit" value="Đăng nhập" />
									<h3 className="show-error">{this.state.error}</h3>
								</div>
							</div>
						</form>
						<div className="bottom-container">
							<div className="row">
								<div className="col">
									<a href="/signup" className="btn">Đăng ký</a>
								</div>
								<div className="col">
									<a href="/forgotpsw" className="btn">Quên mật khẩu?</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>)
    }
}
export default LoginForm;
