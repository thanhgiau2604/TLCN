import React from 'react'

class HeaderBottom extends React.Component{
    constructor(props){
		super(props);
		this.getMenCategory = this.getMenCategory.bind(this);
		this.getGirlCategory = this.getGirlCategory.bind(this);
		this.getKidCategory = this.getKidCategory.bind(this);
		this.getAddiasCategory = this.getAddiasCategory.bind(this);
		this.getNikeCategory = this.getNikeCategory.bind(this);
		this.getSneakerCategory = this.getSneakerCategory.bind(this);
		this.getJordanCategory = this.getJordanCategory.bind(this);
		this.getPumpCategory = this.getPumpCategory.bind(this);
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
	getAddiasCategory(){
		localStorage.setItem("curcategory","Adidas Product");
		window.location.assign("/categoryProduct");
	}
	getSneakerCategory(){
		localStorage.setItem("curcategory","Sneaker Product");
		window.location.assign("/categoryProduct");
	}
	getNikeCategory(){
		localStorage.setItem("curcategory","Nike Product");
		window.location.assign("/categoryProduct");
	}
	getJordanCategory(){
		localStorage.setItem("curcategory","Jordan Product");
		window.location.assign("/categoryProduct");
	}
	getPumpCategory(){
		localStorage.setItem("curcategory","Pump Product");
		window.location.assign("/categoryProduct");
	}
    render(){
        return(
            <section className="header-bottom-area">
			<div className="container">
				<div className="row">
					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
						<div className="left-category-menu">
							<div className="left-product-cat">
								<div className="category-heading">
									<h2>DANH MỤC</h2>
								</div>
								<div className="category-menu-list">
									<ul>
										<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/2.png" alt="" /></span>GIÀY NAM<i className="fa fa-angle-right"></i></a>
											
											<div className="cat-left-drop-menu">
												<div className="cat-left-drop-menu-left">
													<a className="menu-item-heading" href="shop-gird.html">Các loại giày nam</a>
													<ul>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày tây</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày lười</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày cao</a></li>
													</ul>
												</div>
												<div className="cat-left-drop-menu-left">
													<a className="menu-item-heading" href="shop-gird.html">Các loại giày nam</a>
													<ul>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày sandal</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày thể thao</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getMenCategory}>Giày boot</a></li>
													</ul>
												</div>
											</div>										
										</li>
										<li><a style={{cursor:'pointer'}} onClick={this.getGirlCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/1.png" alt="" /></span>GIÀY NỮ<i className="fa fa-angle-right"></i></a>

											<div className="cat-left-drop-menu">
												<div className="cat-left-drop-menu-left">
													<a className="menu-item-heading" href="shop-gird.html">Các loại giày nữ</a>
													<ul>
														<li><a style={{cursor:"pointer"}} onClick={this.getPumpCategory}>Giày cao gót</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getGirlCategory}>Giày búp bê</a></li>
													</ul>
												</div>
												<div className="cat-left-drop-menu-left">
													<a className="menu-item-heading" href="shop-gird.html">Các loại giày nữ</a>
													<ul>
														<li><a style={{cursor:"pointer"}} onClick={this.getGirlCategory}>Giày boot</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getGirlCategory}>Giày sandal</a></li>
														<li><a style={{cursor:"pointer"}} onClick={this.getGirlCategory}>Giày lười</a></li>
													</ul>														
												</div>
											</div>										
										</li>
										<li>
												<a style={{cursor:'pointer'}} onClick={this.getKidCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs">
													<img src="img/layout2/8.png" alt="" /></span>TRẺ EM<i className="fa fa-angle-right"></i></a>
												<div className="cat-left-drop-menu">
													<div className="cat-left-drop-menu-left text-center">
														<a className="menu-item-heading" href="shop-gird.html">Các loại giày trẻ em</a>
														<ul>
															<li><a style={{cursor:"pointer"}} onClick={this.getKidCategory}>Giày Sandal</a></li>
															<li><a style={{cursor:"pointer"}} onClick={this.getKidCategory}>Giày Thể thao</a></li>
															<li><a style={{cursor:"pointer"}} onClick={this.getKidCategory}>Giày Búp bê</a></li>
														</ul>
													</div>
												</div>										
										</li>
										<li><a style={{cursor:'pointer'}} onClick={this.getAddiasCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/9.png" alt="" /></span>ADIDAS<i className="fa fa-angle-right"></i></a>
											
											{/* <div className="cat-left-drop-menu-single">
												<ul>
													<li><a href="/getAdidasProduct">NAM</a></li>
													<li><a href="/getAdidasProduct">NỮ</a></li>
												</ul>
											</div>										 */}
										</li>
										<li><a style={{cursor:'pointer'}} onClick={this.getNikeCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/10.png" alt="" /></span>NIKE<i className="fa fa-angle-right"></i></a>
											
											{/* <div className="cat-left-drop-menu-single">
												<ul>
													<li><a href="/getNikeProduct">NAM</a></li>
													<li><a href="/getNikeProduct">NỮ</a></li>
												</ul>
											</div>											 */}
										</li>
										<li><a style={{cursor:'pointer'}} onClick={this.getSneakerCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/11.jpg" alt="" /></span>SNEAKER<i className="fa fa-angle-right"></i></a>									
											{/* <div className="cat-left-drop-menu-single">
												<ul>
													<li><a href="/getSneakerProduct">NAM</a></li>
													<li><a href="/getSneakerProduct">NỮ</a></li>
												</ul>
											</div>											 */}
										</li>
										<li><a style={{cursor:'pointer'}} onClick={this.getJordanCategory}><span className="cat-thumb hidden-md hidden-sm hidden-xs"><img src="img/layout2/12.png" alt="" /></span>JORDAN<i className="fa fa-angle-right"></i></a>
											{/* <div className="cat-left-drop-menu-single">
												<ul>
													<li><a href="/getJordanProduct">NAM</a></li>
													<li><a href="/getJordanProduct">NỮ</a></li>
												</ul>
											</div> */}
										</li>
									</ul>
								</div>
								
							</div>
						</div>								
					</div>
					<div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">						
						<div className="main-slider-area">
							<div className="slider-area">
								<div id="wrapper">
									<div className="slider-wrapper">
										<div id="mainSlider" className="nivoSlider">
											<img src="img/slider/homepage2/3.jpg" alt="main slider" title="#htmlcaption"/>
											<img src="img/slider/homepage2/4.jpeg" alt="main slider" title="#htmlcaption2"/>
										</div>
										<div id="htmlcaption" className="nivo-html-caption slider-caption">
											<div className="slider-progress"></div>
											<div className="slider-cap-text slider-text1">
												<div className="d-table-cell">
													<h2 className="animated bounceInDown">UY TÍN</h2>												
												</div>
											</div>	
										</div>
										<div id="htmlcaption2" className="nivo-html-caption">
											<div className="slider-progress"></div>
											<div className="slider-cap-text slider-text2">
												<div className="d-table-cell">
													<h2 className="animated bounceInDown">CHẤT LƯỢNG</h2>
												</div>
											</div>
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
export default HeaderBottom;
