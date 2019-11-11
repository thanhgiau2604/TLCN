import React from 'react'


class Product1 extends React.Component{ 
	render(){
		return (<div className="col-xs-6 col-sm-4 col-md-2 col-lg-2">
			<div className="item">
				<div className="single-product-item">
					<div className="product-image">
						<a href="#"><img src={this.props.image} alt="product-image" /></a>
						<a href="#" className="new-mark-box">new</a>
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
								<span>1 Review(s)</span>
							</div>
						</div>
						<a href="single-product.html">{this.props.name}</a>
						<div className="price-box">
							<span className="price">{this.props.cost}</span>
						</div>
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
							return <Product1 key={index} name={sneaker.name} cost={sneaker.cost}
							image={sneaker.image}/>
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
						   return <Product1 key={index} name={sport.name} cost={sport.cost}
						   image={sport.image}/>
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
							return <Product1 key={index} name={pumps.name} cost={pumps.cost}
							image={pumps.image}/>
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
						return <Product1 key={index} name={kid.name} cost={kid.cost}
						image={kid.image}/>
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
export default MainContentSection2;
