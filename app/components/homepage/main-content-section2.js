import React from 'react'
import {connect} from 'react-redux'

var main;
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
class Product1 extends React.Component{ 
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
		return (<div className="col-xs-6 col-sm-4 col-md-2 col-lg-2">
			<div className="item">
				<div className="single-product-item">
					<div className="product-image">
						<a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
						<a href="#" className="new-mark-box"></a>
						<div className="overlay-content">
							<ul>
								<li><a title="Xem sản phẩm" style={{ cursor: 'pointer' }} onClick={this.getDetail}><i className="fa fa-search"></i></a></li>
								<li><a title="Thêm vào giỏ hàng" style={{ cursor: 'pointer' }} onClick={this.addToCart}><i className="fa fa-shopping-cart"></i></a></li>
								<li><a title="Quick view" style={{ cursor: 'pointer' }}><i className="fa fa-retweet"></i></a></li>
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
								<span>1 Review(s)</span>
							</div>
						</div>
						<a href="single-product.html">{this.props.name}</a>
						<div className="price-box">
							<span className="price">{this.props.costs[this.props.costs.length-1].cost}đ</span>
						</div>
						<RequireAuthentication/>
					</div>
				</div>
			</div></div>)
	}
}

class Sneaker extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSneaker:[]
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getSneaker",function(data){
			that.setState({listSneaker:data})
		})
	}
	render(){
		return(<div className="row">
		<div className="col-xs-12">
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">SNEAKER</h2>
				</div>	
				<div className="row">				
					<div className="feartured-carousel">
						{this.state.listSneaker.map(function(sneaker,index){
							return <Product1 key={index} name={sneaker.name} costs={sneaker.costs}
							image={sneaker.image.image1} id={sneaker._id}/>
						})}												
					</div>
				</div>
			</div>
		</div>						
	</div>)
	}
}

class Sports extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSport:[]
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getSport",function(data){
			that.setState({listSport:data})
		})
	}
	render(){
		return(<div className="row">
		<div className="col-xs-12">						
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày thể thao</h2>
				</div>	
				<div className="row">									
					<div className="feartured-carousel">									
				       {this.state.listSport.map(function(sport,index){
						   return <Product1 key={index} name={sport.name} costs={sport.costs}
						   image={sport.image.image1} id={sport._id}/>
					   })}			
					</div>					
				</div>
			</div>		
		</div>						
	</div>)
	}
}

class Pumps extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listPumps:[]
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getPump",function(data){
			that.setState({listPumps:data})
		})
	}
	render(){
		return(<div className="row">
		<div className="col-xs-12">	
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày cao gót</h2>
				</div>	
				<div className="row">							
					<div className="feartured-carousel">
						{this.state.listPumps.map(function(pumps,index){
							return <Product1 key={index} name={pumps.name} costs={pumps.costs}
							image={pumps.image.image1} id={pumps._id}/>
						})}																								
					</div>		
				</div>
			</div>				
		</div>						
	</div>)
	}
}
class Kids extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			listKids : []
		}
	}
	componentDidMount(){
		var that = this;
		$.get("/getKid",function(data){
			that.setState({listKids:data})
		})
	}
	render(){
		return(<div className="row">
		<div className="col-xs-12">				
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày trẻ em</h2>
				</div>	
				<div className="row">
					<div className="feartured-carousel">	
					{this.state.listKids.map(function(kid,index){
						return <Product1 key={index} name={kid.name} costs={kid.costs}
						image={kid.image.image1} id={kid._id}/>
					})}												
					</div>							
				</div>
			</div>						
		</div>						
	</div>)
	}
}
class MainContentSection2 extends React.Component{
    constructor(props){
		super(props);
		main = this;
	}
    render(){
        return(
            <section className="main-content-section-full-column">
			<div className="container">
				<div className="row">
				</div>
				<Sneaker/>
				<div className="row">
					<div className="image-add-area">
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							
							<div className="onehalf-add-shope zoom-img">
								<a href="#"><img alt="shope-add" src="img/product/one-helf1.jpg"/></a>
							</div>
							
						</div>
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							
							<div className="onehalf-add-shope zoom-img">
								<a href="#"><img alt="shope-add" src="img/product/one-helf2.jpg"/></a>
							</div>
						
						</div>						
					</div>						
				</div>
				<Sports/>
				<Pumps/>
				<Kids/>
			</div>
		</section>
        )
    }
}
export default connect(function(state){
    
})(MainContentSection2)
