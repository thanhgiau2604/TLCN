import React from 'react'

class Footer extends React.Component{
    constructor(props){
		super(props);
		this.getMenCategory = this.getMenCategory.bind(this);
		this.getGirlCategory = this.getGirlCategory.bind(this);
		this.getKidCategory = this.getKidCategory.bind(this);
	}
	getMenCategory(){
		localStorage.setItem("curcategory","Men Product");
		window.location.assign("/categoryProduct");
	}
	getGirlCategory(){
		localStorage.setItem("curcategory","Girl Product");
		window.location.assign("/categoryProduct");
	}
	getKidCategory(){
		localStorage.setItem("curcategory","Kid Product");
		window.location.assign("/categoryProduct");
	}
    render(){
        return(
			<section className="footer-top-area">
				<div className="container">
					<div className="footer-top-container">
						<div className="row">
							<div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
								<div className="footer-top-left">
									<div className="newsletter-area">
										<h2>Liên hệ</h2>
										<form action="#">
											<div className="form-group newsletter-form-group">
												<input type="text" className="form-control newsletter-form" placeholder="Email" />
												<br />
												<textarea className="form-control newsletter-form" placeholder="Nội dung"></textarea>
												<input type="submit" className="newsletter-btn" name="submit" value="Gửi" />
											</div>
										</form>
									</div>
									<div className="about-us-area">
									</div>
									<div className="fllow-us-area">
										{/* <h2>Follow us</h2>
										<ul className="flow-us-link">
											<li><a href="#"><i className="fa fa-facebook"></i></a></li>
											<li><a href="#"><i className="fa fa-twitter"></i></a></li>
											<li><a href="#"><i className="fa fa-rss"></i></a></li>
											<li><a href="#"><i className="fa fa-google-plus"></i></a></li>
										</ul> */}
									</div>
								</div>
							</div>
							<div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
								<div className="footer-top-right-1">
									<div className="row">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hidden-sm">
											<div className="staticblock">
												<h2>HỖ TRỢ</h2>
												<p>ShoeLG nhận đặt hàng trực tuyến và giao hàng tận nơi, hỗ trợ mua và nhận hàng trực tiếp tại văn phòng hoặc trung tâm xử lý đơn hàng</p>
											</div>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
											<div className="Store-Information">
												<h2>Thông tin cửa hàng</h2>
												<ul>
													<li>
														<div className="info-lefticon">
															<i className="fa fa-map-marker"></i>
														</div>
														<div className="info-text">
															<p>Số 01, Võ Văn Ngân, Thủ Đức,</p>
															<p>Tp Hồ Chí Minh</p>
														</div>
													</li>
													<li>
														<div className="info-lefticon">
															<i className="fa fa-phone"></i>
														</div>
														<div className="info-text call-lh">
															<p>Gọi chúng tôi: 035 962 7733</p>
														</div>
													</li>
													<li>
														<div className="info-lefticon">
															<i className="fa fa-envelope-o"></i>
														</div>
														<div className="info-text">
															<p>Email : <a href="#"><i className="fa fa-angle-double-right"></i> nguyengiau.9801@gmail.com</a></p>
														</div>
													</li>
												</ul>
											</div>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
											<div className="google-map-area">
												<div className="google-map">
													<div id="googleMap">
														<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.47644496074!2d106.75338911411706!3d10.85132066077567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527bd80c66b4f%3A0x1243c8a70dc5d2e0!2zMSBWw7UgVsSDbiBOZ8OibiwgTGluaCBDaGnhu4N1LCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1571492066824!5m2!1sen!2s" width="100%" height="150px" frameborder="0" allowfullscreen="true"></iframe>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="footer-top-right-2">
									<div className="row">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">

											<div className="fotter-menu-widget">
												<div className="single-f-widget">
													<h2>Danh mục</h2>
													<ul>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}><i className="fa fa-angle-double-right"></i>Giày nam </a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getGirlCategory}><i className="fa fa-angle-double-right"></i>Giày nữ</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getKidCategory}><i className="fa fa-angle-double-right"></i>Trẻ em</a></li>
													</ul>
												</div>
											</div>

										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6">

											<div className="fotter-menu-widget">
												<div className="single-f-widget">
													<h2>Quản lý</h2>
													<ul>
														<li><a href="/manageaccount"><i className="fa fa-angle-double-right"></i>Tài khoản</a></li>
														<li><a href="/checkout"><i className="fa fa-angle-double-right"></i>Thanh toán</a></li>
														<li><a href="/contact"><i className="fa fa-angle-double-right"></i>Liên hệ</a></li>
													</ul>
												</div>
											</div>

										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">

											<div className="fotter-menu-widget">
												<div className="single-f-widget">
													<h2>Thông tin</h2>
													<ul>
														<li><a href="/listfavorite"><i className="fa fa-angle-double-right"></i>Danh sách yêu thích</a></li>
														<li><a href="/orderhistory"><i className="fa fa-angle-double-right"></i>Danh sách order</a></li>
														<li><a href="/message"><i className="fa fa-angle-double-right"></i>Tin nhắn</a></li>
													</ul>
												</div>
											</div>

										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

											<div className="payment-method">
												<img className="img-responsive pull-right" src="img/payment.png" alt="payment-method" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>)
    }
}
export default Footer;
