import React from 'react'

var main;
class Product1 extends React.Component{ //product for polular product
	render(){
		return(<div className="single-product-item">
		<div className="sidebar-product-image">
			<a href="single-product.html"><img src={this.props.image} alt="product-image" /></a>
		</div>
		<div className="product-info sede-pro-info">
			<a href="single-product.html">{this.props.name}</a>
			<div className="customar-comments-box">
				<div className="rating-box">
					<i className="fa fa-star"></i>
					<i className="fa fa-star"></i>
					<i className="fa fa-star"></i>
					<i className="fa fa-star"></i>
					<i className="fa fa-star"></i>
				</div>
			</div>
			<div className="price-box">
				<span className="price">$22.95</span>
				<span className="old-price">$27.00</span>
			</div>
		</div>
	</div>)
	}
}

class Product2 extends React.Component{
	render(){
		return(
			<div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
			<div className="item">
				<div className="new-product">
					<div className="single-product-item">
						<div className="product-image">
							<a href="#"><img src={this.props.image} alt="product-image" /></a>
							<a href="#" className="new-mark-box">{this.props.desc}</a>
							<div className="overlay-content">
								<ul>
									<li><a href="#" title="Quick view"><i className="fa fa-search"></i></a></li>
									<li><a href="#" title="Quick view"><i className="fa fa-shopping-cart"></i></a></li>
									<li><a href="#" title="Quick view"><i className="fa fa-retweet"></i></a></li>
									<li><a href="#" title="Quick view"><i className="fa fa-heart-o"></i></a></li>
								</ul>
							</div>
						</div>
						<div className="product-info">
							<div className="customar-comments-box">
								<div className="rating-box">
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star-half-empty"></i>
								</div>
								<div className="review-box">
									<span>3 Review(s)</span>
								</div>
							</div>
							<a href="single-product.html">{this.props.name}</a>
							<div className="price-box">
								<span className="price">{this.props.curcost}</span>
							</div>
						</div>
					</div>
				</div>
			</div></div>)}
}
class PopularProduct extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			listPoplular:[]
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getPopular",function(data){			
			 that.setState({listPoplular:data});
			 		
		})
	}
	render(){
		return (<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
			<div className="single-left-sidebar sidebar-left-add">
				<div className="sidebar-left zoom-img">
					<a href="#"><img src="img/product/cms11.jpg" alt="sidebar left" /></a>
				</div>
			</div>
			<div className="single-left-sidebar sidebar-best-seller">
				<div className="left-title-area">
					<h2 className="left-title">BÁN CHẠY</h2>
				</div>
				<div className="row">
					<div className="sidebar-best-seller-carousel">
						<div className="item">
							{this.state.listPoplular.map(function (product, index) {
								return <Product1 key={index} id={product._id}
									name={product.name} image={product.image} />
							})}
						</div>
					</div>
				</div>
			</div>
		</div>)
	}
}
class NewProduct extends React.Component{	
	constructor(props){
		super(props);
		this.state = {
			listNew:[]
		}
		
	}
	componentDidMount(){
		var that = this;
		$.get("/getNew", function (data) {
			that.setState({listNew:data});
		});
	}
	render() {	
	return(
		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<div className="new-product-area">
				<div className="left-title-area">
					<h2 className="left-title">SẢN PHẨM MỚI</h2>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<div className="row">
							<div className="home2-sale-carousel">
								{this.state.listNew.map(function(product,index){
									return <Product2 key={index} id={product._id}
									name={product.name} image={product.image} 
									curcost={product.cost} desc="NEW"/>
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>)}
}
class SaleProduct extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSale: []
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getSale",function(data){		
		     that.setState({listSale:data})		
		})
	}
	render(){
		return(<div className="col-xs-12">						
		<div className="sale-poduct-area new-product-area">
			<div className="left-title-area">
				<h2 className="left-title">KHUYẾN MÃI</h2>
			</div>
			<div className="row">				
				<div className="home2-sale-carousel">					
						{this.state.listSale.map(function (product, index) {
							return <Product2 key={index} id={product._id}
								name={product.name} image={product.image} 
								curcost={product.cost} desc="SALE"/>
						})}											
				</div>										
			</div>
		</div>								
	</div>)
	}
}
class MainContentSection1 extends React.Component{
    constructor(props){
		super(props);
		main = this;
		this.state = {
			listNew:[]
		}
	}
    render(){
        return(
			<section className="main-content-section">
			<div className="container">
				<div className="row">					
					<PopularProduct/>
					<div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
						<div className="row">
							<NewProduct/>
							<SaleProduct/>
						</div>	
					</div>	
				</div>
			</div>
		</section>)
    }
}
export default MainContentSection1;
