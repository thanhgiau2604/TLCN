import React from 'react'
import $ from 'jquery'

var main,mail;
class EnterEmail extends React.Component{
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state ={
			err:""
		}
	}
	handleSubmit(e){
		const email = this.email.value;	
		localStorage.setItem('curemail',email);
		mail = email;
		var that = this;
		$.post("/checkEmail",{email:email},function(data){
			console.log(data);
			if (data==1){
				$.post("/sendCodeToEmail",{email:email},function(data){
					localStorage.setItem("codeInEmail",data);
					main.setState({step:2});
				})
			} else {
				that.setState({err:"Không tồn tại tài khoản. Vui lòng kiểm tra lại!"})
			}
		})
		e.preventDefault();
	}
	render(){
		return(<form onSubmit={this.handleSubmit}>
			<div class="form-group">
				<div class="row">
					<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
						<input type="email" class="form-control" placeholder="Nhập địa chỉ Email" required ref={(data) => { this.email = data;}}/>
					</div>
				</div>
				<h3 style={{color:'red'}} className='text-center'>{this.state.err}</h3>
				<div class="row">
					<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
						<button type="submit" class="btn btn-success">Tiếp tục</button>
					</div>
				</div>
			</div>
		</form>)
	}
}
class ConfirmCode extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			err: ""
		}
		this.goChangePassword = this.goChangePassword.bind(this);
		this.reSendCode = this.reSendCode.bind(this);
	}
	goChangePassword(){
		const code = this.code.value;
		const reallyCode = localStorage.getItem('codeInEmail');
		if (code!=reallyCode){
			this.setState({err:"Bạn nhập mã code không đúng. Vui lòng kiểm tra lại"})
		} else {
			main.setState({step:3});
		}
	}
	reSendCode(){
		var that = this;
		const email = localStorage.getItem('curemail');
		$.post("/sendCodeToEmail",{email:email},function(data){
			localStorage.setItem("codeInEmail",data);
			that.setState({err:"Hệ thống đã gửi lại mã"})
		})
	}
	render(){
		return(<div class="form-group">
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<h3 class="text-center" style={{color:'#f10668'}}>Một mã xác nhận đã được gửi đến email của bạn</h3>
				<h3><a href="https://mail.google.com/" target="_blank" class="text-center" style={{color:'#414eec'}}>Đi đến Gmail</a></h3>
				<h3><a href="https://mail.yahoo.com/" target="_blank" class="text-center" style={{color:'#414eec'}}>Đi đến Yahoomail</a></h3>
				<h3><a style={{cursor:'pointer',color:'#530aca'}} onClick={this.reSendCode} class="text-center">Gửi lại mã</a></h3>
				<input type="email" class="form-control" placeholder="Nhập mã xác nhận" ref={(data) => { this.code = data; }} required/>
				<h3 style={{color:'red'}}>{this.state.err}</h3>
			</div>
		</div>
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<button type="submit" class="btn btn-danger" onClick={this.goChangePassword}>Tiếp tục</button>
			</div>
		</div>
	</div>)
	}
}

class ChangePassword extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			err: ""
		}
		this.changePassword = this.changePassword.bind(this);
	}
	changePassword(){
		console.log("vào");
		var that = this;
		$.post("/resetPassword",{newpass:this.newpass.value,
            repass:this.repass.value, email:mail},function(data){
                console.log(data);
                if (data.err!=""){
                    that.setState({err:data.err})
                } else {
                    window.location.replace("/login");
                }
        })
	}
	render(){
		return(<div class="form-group">
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<input type="password" class="form-control" placeholder="Nhập mật khẩu mới" required ref={(data) => { this.newpass = data; }}/>
			</div>
		</div>
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<input type="password" class="form-control" placeholder="Xác nhận mật khẩu" required ref={(data) => { this.repass = data; }}/>
			</div>
		</div>
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<h3 style={{color:'red'}}>{this.state.err}</h3>
			</div>
		</div>
		<div class="row">
			<div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 col-md-push-3">
				<button type="submit" class="btn btn-success" onClick={this.changePassword}>Cập nhật mật khẩu</button>
			</div>
		</div>
	</div>)
	}
}
class ForgotPasswordForm extends React.Component{
    constructor(props){
		super(props);
		this.state = {
			error : "",
			step: 1
		}
		main = this;
	}

    render(){
	    var htmlStep;
		if (this.state.step==1){
			htmlStep = <EnterEmail/>
		} else if (this.state.step==2){
			htmlStep = <ConfirmCode/>
		} else {
			htmlStep = <ChangePassword/>
		}
        return(
			<section className="main-content-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="bstore-breadcrumb">
								<a href="/">Trang chủ</a>
								<span><i className="fa fa-caret-right"></i></span>
								<span>Quên mật khẩu</span>
							</div>
						</div>
					</div>
					<div className="login container">
						{htmlStep}
						<div className="bottom-container">
							<div className="row">
								<div className="col">
									<a href="/signup" className="btn">Đăng ký</a>
								</div>
								<div className="col">
									<a href="/login" className="btn">Đăng nhập</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>)
    }
}
export default ForgotPasswordForm;
