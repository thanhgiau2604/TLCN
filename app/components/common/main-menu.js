import React from 'react'

class MainMenu extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="main-menu-area thanhmenu">
			<div className="container">
				<div className="row" >
					<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right shopingcartarea ">
						<div className="shopping-cart-out pull-right">
							<div className="shopping-cart">
								<a className="shop-link" href="cart.html" title="View my shopping cart">
									<i className="fa fa-shopping-cart cart-icon"></i>
									<b>Giỏ hàng</b>
									<span className="ajax-cart-quantity">2</span>
								</a>
								<div className="shipping-cart-overly">
									<div className="shipping-item">
										<span className="cross-icon"><i className="fa fa-times-circle"></i></span>
										<div className="shipping-item-image">
											<a href="#"><img src="img/shopping-image.jpg" alt="shopping image" /></a>
										</div>
										<div className="shipping-item-text">
											<span>2 <span className="pro-quan-x">x</span> <a href="#" className="pro-cat">Watch</a></span>
											<span className="pro-quality"><a href="#">S,Black</a></span>
											<p>$22.95</p>
										</div>
									</div>
									<div className="shipping-item">
										<span className="cross-icon"><i className="fa fa-times-circle"></i></span>
										<div className="shipping-item-image">
											<a href="#"><img src="img/shopping-image2.jpg" alt="shopping image" /></a>
										</div>
										<div className="shipping-item-text">
											<span>2 <span className="pro-quan-x">x</span> <a href="#" className="pro-cat">Women Bag</a></span>
											<span className="pro-quality"><a href="#">S,Gary</a></span>
											<p>$19.95</p>
										</div>
									</div>
									<div className="shipping-total-bill">
										<div className="cart-prices">
											<span className="shipping-cost">$2.00</span>
											<span>Phí Ship</span>
										</div>
										<div className="total-shipping-prices">
											<span className="shipping-total">$24.95</span>
											<span>Tổng</span>
										</div>										
									</div>
									<div className="shipping-checkout-btn">
										<a href="checkout.html">Thanh toán <i className="fa fa-chevron-right"></i></a>
									</div>
								</div>
							</div>
						</div>
					</div>	

					<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 no-padding-right menuarea">
						<div className="mainmenu">
							<nav className="">
								<ul className="list-inline mega-menu">
									<li className="active"><a href="/">Trang chủ</a>
										
									</li>
									<li>
										<a href="shop-gird.html">Giày nam</a>
									</li>
									<li>
										<a href="shop-gird.html">Giày nữ</a>
									</li>
									<li>
										<a href="shop-gird.html">Trẻ em</a>

									</li>
									<li>
										<a href="shop-gird.html">Phổ biến</a>
									</li>
									<li>
										<a href="shop-gird.html">Sản phẩm mới</a>
									</li>
									<li><a href="about-us.html">Liên hệ</a></li>
								</ul>
							</nav>
						</div>
					</div>
					
				</div>
				<div className="row">
					
					<div className="col-sm-12 mobile-menu-area">
						<div className="mobile-menu hidden-md hidden-lg" id="mob-menu">
							<span className="mobile-menu-title">MENU</span>
							<nav>
								<ul>
									<li><a href="index-2.html">Trang chủ</a>														
									</li>								
									<li><a href="shop-gird.html">Giày nam</a>
										<ul>
											<li><a href="shop-gird.html">Tops</a>
												<ul>
													<li><a href="shop-gird.html">T-Shirts</a></li>
													<li><a href="shop-gird.html">Blouses</a></li>
												</ul>													
											</li>
											<li><a href="shop-gird.html">Dresses</a>
												<ul>
													<li><a href="shop-gird.html">Casual Dresses</a></li>
													<li><a href="shop-gird.html">Summer Dresses</a></li>
													<li><a href="shop-gird.html">Evening Dresses</a></li>	
												</ul>	
											</li>

										</ul>
									</li>
									<li><a href="shop-gird.html">Giày nữ</a>
										<ul>											
											<li><a href="shop-gird.html">Tops</a>
												<ul>
													<li><a href="shop-gird.html">Sports</a></li>
													<li><a href="shop-gird.html">Day</a></li>
													<li><a href="shop-gird.html">Evening</a></li>
												</ul>														
											</li>
											<li><a href="shop-gird.html">Blouses</a>
												<ul>
													<li><a href="shop-gird.html">Handbag</a></li>
													<li><a href="shop-gird.html">Headphone</a></li>
													<li><a href="shop-gird.html">Houseware</a></li>
												</ul>														
											</li>
											<li><a href="shop-gird.html">Accessories</a>
												<ul>
													<li><a href="shop-gird.html">Houseware</a></li>
													<li><a href="shop-gird.html">Home</a></li>
													<li><a href="shop-gird.html">Health & Beauty</a></li>
												</ul>														
											</li>
										</ul>										
									</li>
									<li><a href="shop-gird.html">Trẻ em</a></li>
									<li><a href="shop-gird.html">Phổ biến</a></li>
									<li><a href="shop-gird.html">Sản phẩm mới</a></li>
									<li><a href="about-us.html">Liên hệ</a></li>
								</ul>
							</nav>
						</div>						
					</div>
					
				</div>				
			</div>
		</div>)
    }
}
export default MainMenu;
