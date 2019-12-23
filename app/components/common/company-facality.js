import React from 'react'

class CompanyFacality extends React.Component{
    constructor(props){
		super(props);
		this.openChat = this.openChat.bind(this);
	}
	openChat(){
		window.open("http://m.me/101083411408294");
	}
    render(){
        return(
			<section className="company-facality">
				<div className="container">
					<div className="row">
						<div className="company-facality-row">
							<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
								<div className="single-facality">
									<div className="facality-icon">
										<i className="fa fa-rocket"></i>
									</div>
									<div className="facality-text">
										<h3 className="facality-heading-text">MIỄN PHÍ SHIP</h3>
										<span>Với đơn hàng từ 200k</span>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
								<div className="single-facality">
									<div className="facality-icon">
										<i className="fa fa-umbrella"></i>
									</div>
									<div className="facality-text">
										<h3 className="facality-heading-text">HỖ TRỢ 24/7</h3>
										<span>Tư vấn trực tuyến</span>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
								<div className="single-facality">
									<div className="facality-icon">
										<i className="fa fa-calendar"></i>
									</div>
									<div className="facality-text">
										<h3 className="facality-heading-text">CẬP NHẬT LIÊN TỤC</h3>
										<span>Cập nhật sản phẩm mới nhất</span>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
								<div className="single-facality">
									<div className="facality-icon">
										<i className="fa fa-refresh"></i>
									</div>
									<div className="facality-text">
										<h3 className="facality-heading-text">30 NGÀY HOÀN TRẢ</h3>
										<span>Đảm bảo hoàn tiền</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="link-messenger" onClick={this.openChat}>
					<img src="/img/messenger.png" />
				</div>
			</section>)
    }
}
export default CompanyFacality;
