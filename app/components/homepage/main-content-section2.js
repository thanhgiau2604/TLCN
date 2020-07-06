import React from 'react'
import {connect} from 'react-redux'
import io from 'socket.io-client'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
const socket = io('http://localhost:3000');
var main;
function formatCurrency(cost){
	return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
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
		} else 
		if (this.props.quantity>0){
			var ok = false;
			var thisSize, thisColor;
			for (var i=0; i<this.props.size.length; i++){
				if (ok) break;
				for (var j=0; j<this.props.size[i].colors.length; j++){
					var sColor = this.props.size[i].colors[j];
					if (sColor.quanty>0){
						thisSize = this.props.size[i].size;
						thisColor = sColor.color;
						ok=true;
						break;
					}
				}
			}
			$.post("/addToCart",{id:this.props.id,email:localStorage.getItem('email'),
			color: thisColor, size:thisSize},function(data){
				var {dispatch} = main.props;
				dispatch({type:"UPDATE_PRODUCT",newcart:data});
			})
		} else {
			NotificationManager.error("Sản phẩm đã hết hàng","Thông báo",3000);
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
		var cost = formatCurrency(this.props.costs[this.props.costs.length-1].cost)
		var oldCost;
		if (this.props.costs.length-2>=0)
			oldCost = formatCurrency(this.props.costs[this.props.costs.length-2].cost)
		return (<div className="col-xs-6 col-sm-4 col-md-2 col-lg-2">
			<div className="item">
				<div className="single-product-item">
					<div className="product-image">
						<a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
						<a href="#" className="new-mark-box">{this.props.status}</a>
						{this.props.quantity<=5 ? <a href="#" class="mark-right">HOT</a> : <a></a>}
						{this.props.quantity<=5&&this.props.quantity!=0 ?<a href="#" class="mark-down">Còn {this.props.quantity} sản phẩm</a> : <a></a>}
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
							{this.props.comments.length>0?<span>{this.props.comments.length} bình luận</span> :<span></span>}
							</div>
						</div>
						<a href="single-product.html">{this.props.name}</a>
						<div className="price-box">
							<span className="price">{cost}</span>
							{this.props.sale||this.props.from=="sale" ?<span className="older-price">{oldCost}</span> :<span></span>}
						</div>
						<RequireAuthentication/>
					</div>
				</div>
			</div></div>)
	}
}
class SaleProduct extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSale: [],
			processing: false
		}
	}
	componentDidMount(){
		var that = this;
		this.setState({processing:true});
		$.get("/getSale",function(data){		
		     that.setState({listSale:data, processing:false})		
		})
	}
	render(){
		return(<div className="col-xs-12">						
		<div className="sale-poduct-area new-product-area">
			<div className="left-title-area">
				<h2 className="left-title">KHUYẾN MÃI</h2>
			</div>
			<div className="row">		
			{this.state.processing==true ? <div class="loader text-center"></div> : <div></div>}			
				<div className="home2-sale-carousel">					
						{this.state.listSale.map(function (product, index) {
							var status = "SALE";
							if (product.quanty==0) status="Hết hàng";
							var comment = [];
							if (product.comments) 
									   if (product.comments.length>0) comment = product.comments;
							return <Product1 key={index} id={product._id}
								name={product.name} image={product.image.image1} 
								costs={product.costs} status={status} size={product.sizes} quantity={product.quanty}
								from="sale" comments={comment}/>
						})}											
				</div>										
			</div>
		</div>								
	</div>)
	}
}
class Sneaker extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSneaker:[],
			processing: false,
			saleTime: {ngay:"00",gio:"00",phut:"00",giay:"00"},
			isSale: false,
			category: {}
		}
	}
	componentDidMount(){
		var that = this;
		this.setState({processing:true});
		$.get("/getSneaker",function(data){
			var status = false;
			if (data.category.status=="sale") status=true;
			that.setState({listSneaker:data.data, processing:false,isSale:status,category:data.category});
		});
		socket.on("sale-sneaker-product",function(receive){
			$.get("/getSneaker",function(data){
				that.setState({listSneaker:data.data,isSale:true});
				socket.emit("run-time-sneaker",receive);
			})
		});
		socket.on("running-time-sneaker",function(data){
			that.setState({saleTime:data,isSale:true});
		})
		socket.on("stop-sale-sneaker",function(idSale){
			$.post("/offSale",{id:that.state.category._id,idOff:idSale},function(data){
				setTimeout(function(){
					$.get("/getSneaker",function(data){
						that.setState({listSneaker:data.data, processing:false,isSale:false,category:data.category});
					})
				},2000)
			})
		});
		socket.on("stop-sale-sneaker-from-admin",function(data){
			setTimeout(function(){
				$.get("/getSneaker",function(data){
					that.setState({listSneaker:data.data, processing:false,isSale:false,category:data.category});
				})
			},2000)
		})
	}
	render(){
		var that = this;
		return(<div className="row">
		<div className="col-xs-12">
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">SNEAKER
					{this.state.isSale ? <span class="saleProduct">sale</span>: <span></span>}</h2>
					{this.state.isSale==true ? <h2 class="text-center timersale">
						Thời gian khuyến mãi còn: {this.state.saleTime.ngay+" ngày "
						+this.state.saleTime.gio+" giờ "+this.state.saleTime.phut+" phút "+this.state.saleTime.giay+" giây"}
					</h2>
					:<h2></h2>}
				</div>	
				<div className="row">
				{this.state.processing==true ? <div class="loader text-center"></div> : <div></div>}				
					<div className="feartured-carousel">
						{this.state.listSneaker.map(function(sneaker,index){
							var status ="";
							if (sneaker.quanty==0) status = "Hết hàng"; else
							if (that.state.isSale) status="sale";
							var comment = [];
									if (sneaker.comments) 
									   if (sneaker.comments.length>0) comment = sneaker.comments;
							return <Product1 key={index} name={sneaker.name} costs={sneaker.costs}
							image={sneaker.image.image1} id={sneaker._id} status={status} size={sneaker.sizes}
							comments={comment} sale={that.state.isSale} quantity={sneaker.quanty}/>
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
			listSport:[],
			processing: false,
			saleTime: {ngay:"00",gio:"00",phut:"00",giay:"00"},
			isSale: false,
			category: {}
		}
	}
	componentDidMount(){
		this.setState({processing:true});
		var that = this;
		$.get("/getSport",function(data){
			var status = false;
			if (data.category.status=="sale") status=true;
			that.setState({listSport:data.data, processing:false,isSale:status,category:data.category});
		})
		socket.on("sale-sport-product",function(receive){
			$.get("/getSport",function(data){
				that.setState({listSport:data.data,isSale:true});
				socket.emit("run-time-sport",receive);
			})
		});
		socket.on("running-time-sport",function(data){
			that.setState({saleTime:data,isSale:true});
		})
		socket.on("stop-sale-sport",function(idSale){
			$.post("/offSale",{id:that.state.category._id,idOff:idSale},function(data){
				setTimeout(function(){
					$.get("/getSport",function(data){
						that.setState({listSport:data.data, processing:false,isSale:false,category:data.category});
					})
				},2000)
			})
		})
		socket.on("stop-sale-sport-from-admin",function(data){
			setTimeout(function(){
				$.get("/getSport",function(data){
					that.setState({listSport:data.data, processing:false,isSale:false,category:data.category});
				})
			},2000)
		})
	}
	render(){
		var that = this;
		return(<div className="row">
		<div className="col-xs-12">						
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày thể thao
					{this.state.isSale ? <span class="saleProduct">sale</span>: <span></span>}</h2>
					{this.state.isSale==true ? <h2 class="text-center timersale">
						Thời gian khuyến mãi còn: {this.state.saleTime.ngay+" ngày "
						+this.state.saleTime.gio+" giờ "+this.state.saleTime.phut+" phút "+this.state.saleTime.giay+" giây"}
					</h2>
					:<h2></h2>}
				</div>	
				<div className="row">	
				{this.state.processing==true ? <div class="loader text-center"></div> : <div></div>}								
					<div className="feartured-carousel">									
				       {this.state.listSport.map(function(sport,index){
						   var status ="";
						   if (sport.quanty==0) status = "Hết hàng"; else 
						   if (that.state.isSale) status="sale"
						   var comment = [];
									if (sport.comments) 
									   if (sport.comments.length>0) comment = sport.comments;
						   return <Product1 key={index} name={sport.name} costs={sport.costs}
						   image={sport.image.image1} id={sport._id} status={status} size={sport.sizes}
						   comments={comment} sale={that.state.isSale} quantity={sport.quanty}/>
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
			listPumps:[],
			processing: false,
			saleTime: {ngay:"00",gio:"00",phut:"00",giay:"00"},
			isSale: false,
			category: {}
		}
	}
	componentDidMount(){
		var that = this;
		this.setState({processing:true});
		$.get("/getPump",function(data){
			var status = false;
			if (data.category.status=="sale") status=true;
			that.setState({listPumps:data.data, processing:false,isSale:status,category:data.category});
		})
		socket.on("sale-pump-product",function(receive){
			$.get("/getPump",function(data){
				that.setState({listPumps:data.data,isSale:true});
				socket.emit("run-time-pump",receive);
			})
		});
		socket.on("running-time-pump",function(data){
			that.setState({saleTime:data,isSale:true});
		})
		socket.on("stop-sale-pump",function(idSale){
			$.post("/offSale",{id:that.state.category._id,idOff:idSale},function(data){
				setTimeout(function(){
					$.get("/getPump",function(data){
						that.setState({listPumps:data.data, processing:false,isSale:false,category:data.category});
					})
				},2000)
			})
		})
		socket.on("stop-sale-pump-from-admin",function(data){
			setTimeout(function(){
				$.get("/getPump",function(data){
					that.setState({listPumps:data.data, processing:false,isSale:false,category:data.category});
				})
			},2000)
		})
	
	}
	render(){
		var that = this;
		return(<div className="row">
		<div className="col-xs-12">	
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày cao gót
					{this.state.isSale ? <span class="saleProduct">sale</span>: <span></span>}</h2>
					{this.state.isSale==true ? <h2 class="text-center timersale">
						Thời gian khuyến mãi còn: {this.state.saleTime.ngay+" ngày "
						+this.state.saleTime.gio+" giờ "+this.state.saleTime.phut+" phút "+this.state.saleTime.giay+" giây"}
					</h2>
					:<h2></h2>}
					
				</div>	
				<div className="row">			
					{this.state.processing==true ? <div class="loader text-center"></div> : <div></div>}				
					<div className="feartured-carousel">
						{this.state.listPumps.map(function(pumps,index){
							var status="";
							if (pumps.quanty==0) status="Hết hàng"; else 
							if (that.state.isSale) status="sale"
							var comment = [];
									if (pumps.comments) 
									   if (pumps.comments.length>0) comment = pumps.comments;
							return <Product1 key={index} name={pumps.name} costs={pumps.costs}
							image={pumps.image.image1} id={pumps._id} status={status} size={pumps.sizes}
							comments={comment} sale={that.state.isSale} quantity={pumps.quanty}/>
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
			listKids : [],
			processing: false,
			saleTime: {ngay:"00",gio:"00",phut:"00",giay:"00"},
			isSale: false,
			category: {}
		}
	}
	componentDidMount(){
		var that = this;
		this.setState({processing:true});
		$.get("/getKid",function(data){
			var status = false;
			if (data.category.status=="sale") status=true;
			that.setState({listKids:data.data, processing:false,isSale:status,category:data.category});
		});
		socket.on("sale-kid-product",function(receive){
			$.get("/getKid",function(data){
				that.setState({listKids:data.data,isSale:true});
				socket.emit("run-time-kid",receive);
			})
		});
		socket.on("running-time-kid",function(data){
			that.setState({saleTime:data,isSale:true});
		})
		socket.on("stop-sale-kid",function(idSale){
			$.post("/offSale",{id:that.state.category._id,idOff:idSale},function(data){
				setTimeout(function(){
					$.get("/getKid",function(data){
						that.setState({listKids:data.data, processing:false,isSale:false,category:data.category});
					})
				},2000)
			})
		})
		socket.on("stop-sale-kid-from-admin",function(data){
			setTimeout(function(){
				$.get("/getKid",function(data){
					that.setState({listKids:data.data, processing:false,isSale:false,category:data.category});
				})
			},2000)
		})
	}
	render(){
		var that = this;
		return(<div className="row">
		<div className="col-xs-12">				
			<div className="featured-products-area">
				<div className="left-title-area">
					<h2 className="left-title">Giày trẻ em
					{this.state.isSale ? <span class="saleProduct">sale</span>: <span></span>}</h2>
					{this.state.isSale==true ? <h2 class="text-center timersale">
						Thời gian khuyến mãi còn: {this.state.saleTime.ngay+" ngày "
						+this.state.saleTime.gio+" giờ "+this.state.saleTime.phut+" phút "+this.state.saleTime.giay+" giây"}
					</h2>
					:<h2></h2>}
				</div>	
				<div className="row">
				{this.state.processing==true ? <div class="loader text-center"></div> : <div></div>}
					<div className="feartured-carousel">	
					{this.state.listKids.map(function(kid,index){
						var status="";
						if (kid.quanty==0) status="Hết hàng"; else
						if (that.state.isSale) status="sale"
						var comment = [];
									if (kid.comments) 
									   if (kid.comments.length>0) comment = kid.comments;
						return <Product1 key={index} name={kid.name} costs={kid.costs}
						image={kid.image.image1} id={kid._id} status={status} size={kid.sizes}
						comments={comment} sale={that.state.isSale} quantity={kid.quanty}/>
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
			<NotificationContainer />
			<div className="container">
				<div className="row">
				</div>
				{localStorage.getItem("email") ? <SaleProduct/> : <div></div>}
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
