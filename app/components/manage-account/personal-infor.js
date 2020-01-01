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

var inforuser;
class InforEdit extends React.Component {
	constructor(props){
		super(props);
		this.save = this.save.bind(this);
		this.cancel = this.cancel.bind(this);
	}
	save(e){
		$.post("/editinfor",{firstname: this.firstname.value, lastname:this.lastname.value,
			phone:this.phonenumber.value,email:this.email.value, day:this.refs.day.value,
			month:this.refs.month.value,year:this.refs.year.value},function(data){
			localStorage.setItem('username',data.lastName);
			localStorage.setItem('email',data.email);
			inforuser.setState({isEdit:false});
			inforuser.setState({user:data});
		});
		e.preventDefault();
	}
	cancel(){
		inforuser.setState({isEdit:false})
	}
	render(){
		var arrdob = inforuser.state.user.dob.split("/");
		return (<div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 col-lg-push-4 col-md-push-3 col-sm-push-3">
			<form onSubmit={this.save}>
				<div className="account-info">
					<div className="single-account-info">
						<div className="form-group">
							<label className="control-label" for="firstname">Họ</label>
							<div className="input-wrap">
								<input type="text" className="form-control" defaultValue={inforuser.state.user.firstName} placeholder="Họ tên" ref={(data) => { this.firstname= data; }}/>
								<span className="help-block"></span>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label" for="lastname">Tên</label>
							<div className="input-wrap">
								<input type="text" className="form-control" defaultValue={inforuser.state.user.lastName} placeholder="Họ tên" ref={(data) => { this.lastname= data; }}/>
								<span className="help-block"></span>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label" for="phone_number">Số điện thoại</label>
							<div className="input-wrap">
								<input type="text" defaultValue={inforuser.state.user.numberPhone} className="form-control" name="phone_number" id="phone_number" placeholder="Số điện thoại" ref={(data) => { this.phonenumber= data; }}/>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label" for="email">Email</label>
							<div className="input-wrap">
								<input type="email" defaultValue={inforuser.state.user.email} className="form-control" name="email" id="form_email" placeholder="Email" ref={(data) => { this.email= data; }}/>
							</div>
						</div>
						<div className="form-group ">
							<label className="control-label no-lh" for="birthdate">
								Ngày sinh
						<span>(Không bắt buộc)</span>
							</label>
							<div className="input-wrap">
								<div id="birthday-picker" className="birthday-picker">
									<div id="birthday-picker" className="birthday-picker">
										<fieldset className="birthday-picker">
											<select className="birth-day form-control" name="birth[day]" defaultValue={arrdob[0]} ref="day">
												<option value="0">Ngày</option>			
												<option value="1">01</option>
												<option value="2">02</option>
												<option value="3">03</option>
												<option value="4">04</option>
												<option value="5">05</option>
												<option value="6">06</option>
												<option value="7">07</option>
												<option value="8">08</option>
												<option value="9">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
												<option value="13">13</option>
												<option value="14">14</option>
												<option value="15">15</option>
												<option value="16">16</option>
												<option value="17">17</option>
												<option value="18">18</option>
												<option value="19">19</option>
												<option value="20">20</option>
												<option value="21">21</option>
												<option value="22">22</option>
												<option value="23">23</option>
												<option value="24">24</option>
												<option value="25">25</option>
												<option value="26">26</option>
												<option value="27">27</option>
												<option value="28">28</option>
												<option value="29">29</option>
												<option value="30">30</option>
												<option value="31">31</option>
											</select>
											<select className="birth-month form-control" name="birth[month]" defaultValue={arrdob[1]} ref="month">
												<option value="0">Tháng</option>
												<option value="1">01</option>
												<option value="2">02</option>
												<option value="3">03</option>
												<option value="4">04</option>
												<option value="5">05</option>
												<option value="6">06</option>
												<option value="7">07</option>
												<option value="8">08</option>
												<option value="9">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
											</select>
											<select className="birth-year form-control" name="birth[year]" defaultValue={arrdob[2]} ref="year">
												<option value="0">Năm</option>
												<option value="2019">2019</option>
												<option value="2018">2018</option>
												<option value="2017">2017</option>
												<option value="2016">2016</option>
												<option value="2015">2015</option>
												<option value="2014">2014</option>
												<option value="2013">2013</option>
												<option value="2012">2012</option>
												<option value="2011">2011</option>
												<option value="2010">2010</option>
												<option value="2009">2009</option>
												<option value="2008">2008</option>
												<option value="2007">2007</option>
												<option value="2006">2006</option>
												<option value="2005">2005</option>
												<option value="2004">2004</option>
												<option value="2003">2003</option>
												<option value="2002">2002</option>
												<option value="2001">2001</option>
												<option value="2000">2000</option>
												<option value="1999">1999</option>
												<option value="1998">1998</option>
												<option value="1997">1997</option>
												<option value="1996">1996</option>
												<option value="1995">1995</option>
												<option value="1994">1994</option>
												<option value="1993">1993</option>
												<option value="1992">1992</option>
												<option value="1991">1991</option>
												<option value="1990">1990</option>
												<option value="1989">1989</option>
												<option value="1988">1988</option>
												<option value="1987">1987</option>
												<option value="1986">1986</option>
												<option value="1985">1985</option>
												<option value="1984">1984</option>
												<option value="1983">1983</option>
												<option value="1982">1982</option>
												<option value="1981">1981</option>
												<option value="1980">1980</option>
												<option value="1979">1979</option>
												<option value="1978">1978</option>
												<option value="1977">1977</option>
												<option value="1976">1976</option>
												<option value="1975">1975</option>
											</select>
											{/* <input type="hidden" name="birthdate" id="birthdate" value="1998-04-26" /> */}
										</fieldset>
									</div>
								</div>
								<span className="help-block"></span>
							</div>

						</div>
						<div>
							<button className="btnHandle btn btn-success" onClick={this.save}>Lưu</button>
						</div>
						<div>
							<button className="btnHandle btn btn-warning" onClick={this.cancel}>Cancel</button>
						</div>			
					</div>
				</div>
			</form>
		</div>)
	}
}
class Infor extends React.Component{
	constructor(props){
		super(props);
		this.edit = this.edit.bind(this);
		this.changePassword = this.changePassword.bind(this);
	}
	edit(){
		inforuser.setState({isEdit:true})
	}
	changePassword(){
		window.location.assign("/changepassword");
	}
	render(){
		var arrdob = String(inforuser.state.user.dob).split("/");
		return(<div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 col-lg-push-4 col-md-push-3 col-sm-push-3">
			<div className="account-info">
				<div className="single-account-info">
					<div className="form-group">
						<label className="control-label" for="full_name">Họ tên </label>
						<div className="input-wrap">
							<input type="text" name="full_name" className="form-control" id="full_name" disabled value={inforuser.state.user.firstName + " " + inforuser.state.user.lastName} placeholder="Họ tên" />
							<span className="help-block"></span>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label" for="phone_number">Số điện thoại</label>
						<div className="input-wrap">
							<input type="text" disabled value={inforuser.state.user.numberPhone} className="form-control" name="phone_number" id="phone_number" placeholder="Số điện thoại" />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label" for="email">Email</label>
						<div className="input-wrap">
							<input type="email" disabled value={inforuser.state.user.email} className="form-control" name="email" id="form_email" placeholder="Email" />
						</div>
					</div>
					<div className="form-group ">
						<label className="control-label no-lh" for="birthdate">
							Ngày sinh
						<span>(Không bắt buộc)</span>
						</label>

						<div className="input-wrap">
							<div id="birthday-picker" className="birthday-picker">
								<div id="birthday-picker" className="birthday-picker">
									<fieldset className="birthday-picker">
										<select className="birth-day form-control" name="birth[day]" value={arrdob[0]}>
											<option value="0">Ngày</option>
											<option value="1">01</option>
											<option value="2">02</option>
											<option value="3">03</option>
											<option value="4">04</option>
											<option value="5">05</option>
											<option value="6">06</option>
											<option value="7">07</option>
											<option value="8">08</option>
											<option value="9">09</option>
											<option value="10">10</option>
											<option value="11">11</option>
											<option value="12">12</option>
											<option value="13">13</option>
											<option value="14">14</option>
											<option value="15">15</option>
											<option value="16">16</option>
											<option value="17">17</option>
											<option value="18">18</option>
											<option value="19">19</option>
											<option value="20">20</option>
											<option value="21">21</option>
											<option value="22">22</option>
											<option value="23">23</option>
											<option value="24">24</option>
											<option value="25">25</option>
											<option value="26">26</option>
											<option value="27">27</option>
											<option value="28">28</option>
											<option value="29">29</option>
											<option value="30">30</option>
											<option value="31">31</option>
										</select>
										<select className="birth-month form-control" name="birth[month]" value={arrdob[1]}>
											<option value="0">Tháng</option>
											<option value="1">01</option>
											<option value="2">02</option>
											<option value="3">03</option>
											<option value="4">04</option>
											<option value="5">05</option>
											<option value="6">06</option>
											<option value="7">07</option>
											<option value="8">08</option>
											<option value="9">09</option>
											<option value="10">10</option>
											<option value="11">11</option>
											<option value="12">12</option>
										</select>
										<select className="birth-year form-control" name="birth[year]" value={arrdob[2]}>
											<option value="0">Năm</option>
											<option value="2019">2019</option>
											<option value="2018">2018</option>
											<option value="2017">2017</option>
											<option value="2016">2016</option>
											<option value="2015">2015</option>
											<option value="2014">2014</option>
											<option value="2013">2013</option>
											<option value="2012">2012</option>
											<option value="2011">2011</option>
											<option value="2010">2010</option>
											<option value="2009">2009</option>
											<option value="2008">2008</option>
											<option value="2007">2007</option>
											<option value="2006">2006</option>
											<option value="2005">2005</option>
											<option value="2004">2004</option>
											<option value="2003">2003</option>
											<option value="2002">2002</option>
											<option value="2001">2001</option>
											<option value="2000">2000</option>
											<option value="1999">1999</option>
											<option value="1998">1998</option>
											<option value="1997">1997</option>
											<option value="1996">1996</option>
											<option value="1995">1995</option>
											<option value="1994">1994</option>
											<option value="1993">1993</option>
											<option value="1992">1992</option>
											<option value="1991">1991</option>
											<option value="1990">1990</option>
											<option value="1989">1989</option>
											<option value="1988">1988</option>
											<option value="1987">1987</option>
											<option value="1986">1986</option>
											<option value="1985">1985</option>
											<option value="1984">1984</option>
											<option value="1983">1983</option>
											<option value="1982">1982</option>
											<option value="1981">1981</option>
											<option value="1980">1980</option>
											<option value="1979">1979</option>
											<option value="1978">1978</option>
											<option value="1977">1977</option>
											<option value="1976">1976</option>
											<option value="1975">1975</option>
										</select>
										<input type="hidden" name="birthdate" id="birthdate" value="1998-04-26" />
									</fieldset>
								</div>
							</div>
							<span className="help-block"></span>
						</div>
					</div>
					<div>
						<button className="btnHandle btn btn-success" onClick={this.edit}>Thay đổi thông tin</button>
					</div>
					<div>
						<button className="btnHandle btn btn-warning" onClick={this.changePassword}>Đổi mật khẩu</button>
					</div>
				</div>
			</div>
	</div>)
	}
}
class InforForm extends React.Component{
    constructor(props){
		super(props);
		this.state = {
			isEdit: false,
			user : "",
			permission: 0
		}
		inforuser = this;
		this.goLogin = this.goLogin.bind(this);
	}

	componentDidMount(){
		var token = localStorage.getItem('token');
        if (!token) {
            this.setState({ permission: 0 });
        }
        var that = this;
        $.get("/api", { token: token }, function (data) {
            if (data.success == 1) {
				var email = localStorage.getItem('email');
				$.post("/getInforUser", { email: email }, function (data) {
					that.setState({ user: data,permission:1 });
				})
            }
        })
	}
	goLogin(){
        window.location.replace("/login");
    }
    render(){
		if (this.state.permission==0){
			return (<div className="text-center">
                <br/>
                <h3>Để thực hiện chức năng này bạn phải đăng nhập!</h3>
                <button className="btn btn-primary" onClick={this.goLogin} style={{marginTop:'10px'}}>Đi đến trang đăng nhập</button>
            </div>)
		} else {
			var formrender;
		if (this.state.isEdit==true)
		{
			formrender = <InforEdit/>
		} else {
			formrender = <Infor/>
		}
        return(
            <section className="main-content-section">
		 	<div className="container">
		 		<div className="row">
		 			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		 				<div className="bstore-breadcrumb">
		 					<a href="/">Trang chủ<i className="fa fa-angle-double-right"></i></a>
		 					<a href="/manageaccount">Quản lý tài khoản<i className="fa fa-angle-double-right"></i></a>
		 					<span>Thông tin tài khoản</span>
		 				</div>
		 			</div>
		 		</div>
		 		<div className="row">
		 			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		 				<h2 className="page-title text-center">Thông Tin Cá Nhân</h2>
		 			</div>	
		 			{formrender}
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
}

ReactDOM.render(
	<Provider store={store}>
		<HeaderTop />
		<HeaderMiddle />
		<MainMenu />
		<InforForm/>
		<CompanyFacality />
		<Footer />
		<CopyRight />
	</Provider>,document.getElementById("personal-infor")
)

