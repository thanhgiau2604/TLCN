import React from 'react'
import {connect} from 'react-redux'
var main;
class Product1 extends React.Component{ //product for polular product
	constructor(props){
		super(props);
		this.getDetail = this.getDetail.bind(this);
	}
	getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
	}
	render(){
		return(<div className="single-product-item">
		<div className="sidebar-product-image">
			<a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
		</div>
		<div className="product-info sede-pro-info">
			<a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
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
				<span className="price">{this.props.costs[this.props.costs.length-1].cost}đ</span>
			</div>
		</div>
	</div>)
	}
}
class RequireAuthentication extends React.Component{
	constructor(props){
		super(props);
		this.goAuthen = this.goAuthen.bind(this);
	}
	goAuthen(){
		window.location.replace("/login");
	}
	render(){
		return(<div id="modal-authen" class="modal fade" role="dialog">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <button type="button" class="close" data-dismiss="modal">&times;</button>
			  <h4 class="modal-title">Thông báo</h4>
			</div>
			<div class="modal-body text-center">
			  <p>Bạn chưa đăng nhập?</p>
			  <p>Hãy click vào nút bên dưới để đi đến trang đăng nhập!</p>
			  <button class="btn btn-primary" onClick={this.goAuthen}>ĐI ĐẾN TRANG ĐĂNG NHẬP</button>
			</div>
			<div class="modal-footer">
			  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
			</div>
		  </div>
		</div>
	  </div>)
	}
}
class Product2 extends React.Component{
	constructor(props){
		super(props);
		this.getDetail = this.getDetail.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.handleFavorite = this.handleFavorite.bind(this);
		this.state = {
			isFavorite:false
		}
	}
	getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
	}
	addToCart(){
		const token = localStorage.getItem('token');
		if (!token){
			$("#modal-authen").modal('show');
		} else {
			$.post("/addToCart",{id:this.props.id,email:localStorage.getItem('email')},function(data){
				var {dispatch} = main.props;
				dispatch({type:"UPDATE_PRODUCT",newcart:data});
			})
		}
	}
	handleFavorite(){
		const token = localStorage.getItem('token');
		var that = this;
		if (!token) {
			$("#modal-authen").modal('show');
		} else {
			if (this.state.isFavorite == false)
			{
				$.post("/addToFavorite", {id:this.props.id, email: localStorage.getItem('email') }, function (data) {
					that.setState({isFavorite:true});
				})
			} else {
				$.post("/deleteFav",{idDel:this.props.id,email:localStorage.getItem('email')},function(data){
					that.setState({isFavorite:false});
				})
			}	
		}
	}
	componentDidMount(){
		const email = localStorage.getItem('email');
		var that = this;
		if (email) {
			$.post("/checkFavorite", { idProduct: this.props.id, email: email }, function (data) {
				if (data == 1) {
					that.setState({ isFavorite: true });
				}
			})
		}
	}
	render(){
		var htmlFavorite;
		if (this.state.isFavorite==true){
			htmlFavorite=<li><a title="Xóa khỏi favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o" style={{color:'#daf309'}}></i></span></a></li>
		} else {
			htmlFavorite=<li><a title="Thêm vào favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o"></i></span></a></li>
		}
		return(
			<div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
			<div className="item">
				<div className="new-product">
					<div className="single-product-item">
						<div className="product-image">
							<a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
							<a href="#" className="new-mark-box">{this.props.desc}</a>
							<div className="overlay-content">
								<ul>
									<li><a title="Xem sản phẩm" style={{cursor:'pointer'}} onClick={this.getDetail}><i className="fa fa-search"></i></a></li>
									<li><a title="Thêm vào giỏ hàng" style={{cursor:'pointer'}} onClick={this.addToCart}><i className="fa fa-shopping-cart"></i></a></li>
									<li><a title="Quick view" style={{cursor:'pointer'}}><i className="fa fa-retweet"></i></a></li>
									{htmlFavorite}
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
							<a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
							<div className="price-box">
								<span className="price">{this.props.costs[this.props.costs.length-1].cost}đ</span>
								<span className="older-price">{this.props.costs[this.props.costs.length-2].cost}đ</span>
							</div>
						</div>
						<RequireAuthentication/>
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
			console.log(data);			
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
					<h2 className="left-title">PHỔ BIẾN</h2>
				</div>
				<div className="row">
					<div className="sidebar-best-seller-carousel">
						<div className="item">
							{this.state.listPoplular.map(function (product, index) {
								return <Product1 key={index} id={product._id}
									name={product.name} image={product.image.image1} costs={product.costs}/>
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
									name={product.name} image={product.image.image1} 
									costs={product.costs} desc="NEW"/>
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
								name={product.name} image={product.image.image1} 
								costs={product.costs} desc="SALE"/>
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
export default connect(function(state){
    
})(MainContentSection1)
