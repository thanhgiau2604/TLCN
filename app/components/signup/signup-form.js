import React from 'react'

var error =  "";
class SignUpForm extends React.Component{
    constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			error: ""
		}
	}
	handleSubmit(e){
		const firstName = this.firstName.value;
		const lastName = this.lastName.value;
		const email = this.email.value;
		const phoneNumber = this.phoneNumber.value;
		const password = this.password.value;
		const repass = this.repass.value;
		const dob = this.refs.day.value+"/"+this.refs.month.value+"/"+this.refs.year.value;
		var form = this;
		$.post("/signup",{firstname: firstName, lastname:lastName, email:email, phonenumber:phoneNumber,
		password:password, repass:repass, dob:dob},function(data){
			if (data!="success"){
				form.setState({error:data})
			} else {
				window.location.assign("/login");
			}
		})
		e.preventDefault();
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
							<span>Đăng ký</span>
						</div>						
					</div>
				</div>
				<div className="row signup">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
						<h2 className="page-title">TẠO TÀI KHOẢN</h2>
					</div>
					<form onSubmit={this.handleSubmit}>
							<div className="container">
								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="firstname"><b>Họ</b></label>
										<input type="text" placeholder="Nhập Họ" name="firstname" required ref={(data) => { this.firstName = data; }}/>
									</div>
								</div>

								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="lastname"><b>Tên</b></label>
										<input type="text" placeholder="Nhập Tên" name="lastname" required ref={(data) => { this.lastName = data; }}/>
									</div>
								</div>

								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="email"><b>Email</b></label>
										<input type="text" placeholder="Nhập Email" name="email" required ref={(data) => { this.email = data; }}/>
									</div>
								</div>

								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="phonenumber"><b>Số điện thoại</b></label>
										<input type="text" placeholder="Nhập số điện thoại" name="phonenumber" ref={(data) => { this.phoneNumber = data; }}/>
									</div>
								</div>
								
								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="password"><b>Mật khẩu</b></label>
										<input type="password" placeholder="Nhập mật khẩu" name="password" required ref={(data) => { this.password = data; }}/>
									</div>
								</div>
								
								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label for="repass"><b>Xác nhận mật khẩu</b></label>
										<input type="password" placeholder="Nhập lại mật khẩu" name="repass" required ref={(data) => { this.repass = data; }}/>
									</div>
								</div>	

								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<label><b>Ngày sinh</b></label>
										<br/>
										<div className="birth-day">
											<select id="d-b-day" name="day" ref="day" required>
												<option>- &nbsp;&nbsp;</option>
												<option value="1">1 </option>
												<option value="2">2 </option>
												<option value="3">3 </option>
												<option value="4">4 </option>
												<option value="5">5 </option>
												<option value="6">6 </option>
												<option value="7">7 </option>
												<option value="8">8 </option>
												<option value="9">9 </option>
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
										</div>
										<div className="birth-month">
											<select id="d-b-month" name="month" ref="month" required>
												<option value="">- &nbsp;&nbsp;</option>
												<option value="1">Tháng 1</option>
												<option value="2">Tháng 2 </option>
												<option value="3">Tháng 3</option>
												<option value="4">Tháng 4</option>
												<option value="5">Tháng 5</option>
												<option value="6">Tháng 6</option>
												<option value="7">Tháng 7</option>
												<option value="8">Tháng 8</option>
												<option value="9">Tháng 9</option>
												<option value="10">Tháng 10</option>
												<option value="11">Tháng 11</option>
												<option value="12">Tháng 12</option>
											</select>												
										</div>
										<div className="birth-year">
											<select id="d-b-year" name="year" ref="year" required>
												<option value="">-  &nbsp;&nbsp;</option>
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
												<option value="1974">1974</option>
												<option value="1973">1973</option>
												<option value="1972">1972</option>
												<option value="1971">1971</option>
												<option value="1970">1970</option>
												<option value="1969">1969</option>
												<option value="1968">1968</option>
												<option value="1967">1967</option>
												<option value="1966">1966</option>
												<option value="1965">1965</option>
												<option value="">1964</option>
												<option value="">1963</option>
												<option value="">1962</option>
												<option value="">1961</option>
												<option value="">1960</option>
												<option value="">1959</option>
												<option value="">1958</option>
												<option value="">1957</option>
												<option value="">1956</option>
												<option value="">1955</option>
												<option value="">1954</option>
												<option value="">1953</option>
												<option value="">1952</option>
												<option value="">1951</option>
												<option value="">1950</option>
												<option value="">1949</option>
												<option value="">1948</option>
												<option value="">1947</option>
												<option value="">1946</option>
												<option value="">1945</option>
												<option value="">1944</option>
												<option value="">1943</option>
												<option value="">1942</option>
												<option value="">1941</option>
												<option value="">1940</option>
												<option value="">1939</option>
												<option value="">1938</option>
												<option value="">1937</option>
												<option value="">1936</option>
												<option value="">1935</option>
												<option value="">1934</option>
												<option value="">1933</option>
												<option value="">1932</option>
												<option value="">1931</option>
												<option value="">1930</option>
												<option value="">1929</option>
												<option value="">1928</option>
												<option value="">1927</option>
												<option value="">1926</option>
												<option value="">1925</option>
												<option value="">1924</option>
												<option value="">1923</option>
												<option value="">1922</option>
												<option value="">1921</option>
												<option value="">1920</option>
												<option value="">1919</option>
												<option value="">1918</option>
												<option value="">1917</option>
												<option value="">1916</option>
												<option value="">1915</option>
												<option value="">1914</option>
												<option value="">1913</option>
												<option value="">1912</option>
												<option value="">1911</option>
												<option value="">1910</option>
												<option value="">1909</option>
												<option value="">1908</option>
												<option value="">1907</option>
												<option value="">1906</option>
												<option value="">1905</option>
												<option value="">1904</option>
												<option value="">1903</option>
												<option value="">1902</option>
												<option value="">1901</option>
												<option value="">1900</option>
											</select>													
										</div>
									</div>
								</div>	

								<hr/>
								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
										<button type="submit" className="registerbtn">Đăng ký</button>
									</div>
								</div>	
								<h3 className="show-error">{this.state.error}</h3>	
							</div>
							<div className="container signin text-center">
								<p>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>.</p>
							</div>
					</form>		
					</div>	
					
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					</div>
				</div>
		</section>)
    }
}
export default SignUpForm;
