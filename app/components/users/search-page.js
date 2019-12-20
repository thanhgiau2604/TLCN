import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'

var items,table;

class Product extends React.Component{ 
	constructor(props){
		super(props);
		this.getDetail = this.getDetail.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.handleFavorite = this.handleFavorite.bind(this);
	}
	getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
	}
	addToCart(){
		$.post("/addToCart",{id:this.props.id,email:localStorage.getItem('email')},function(data){
			var {dispatch} = main.props;
        	dispatch({type:"UPDATE_PRODUCT",newcart:data});
		})
	}
	handleFavorite(){
		$.post("/addToFavorite",{id:this.props.id,email:localStorage.getItem('email')},function(data){
			if (data.success==1){
				console.log("Add thành công");
			}
		})
	}
	render(){
		return (<div className="col-xs-6 col-sm-4 col-md-2 col-lg-2">
			<div className="item">
				<div className="single-product-item">
					<div className="product-image">
						<a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
						<a href="#" className="new-mark-box">new</a>
						<div className="overlay-content">
							<ul>
								<li><a title="Xem sản phẩm" style={{ cursor: 'pointer' }} onClick={this.getDetail}><i className="fa fa-search"></i></a></li>
								<li><a title="Thêm vào giỏ hàng" style={{ cursor: 'pointer' }} onClick={this.addToCart}><i className="fa fa-shopping-cart"></i></a></li>
								<li><a title="Quick view" style={{ cursor: 'pointer' }}><i className="fa fa-retweet"></i></a></li>
								<li><a title="Thêm vào favorite list" style={{ cursor: 'pointer' }} onClick={this.handleFavorite}><i className="fa fa-heart-o"></i></a></li>
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
						<a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
						<div className="price-box">
							<span className="price">{this.props.costs[this.props.costs.length-1].cost}đ</span>
						</div>
					</div>
				</div>
			</div></div>)
	}
}
class SearchProduct extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			listSearch:[]
		}
	}
	componentDidMount(){
        var that = this;
        var keysearch = localStorage.getItem('keysearch');
		$.post("/itemSearch",{keysearch:keysearch},function(data){
            console.log(data);
			that.setState({listSearch:data});
		})
	}
	render(){
        return (<div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <div className="featured-products-area">
                        <div className="left-title-area">
                            <h2 className="left-title">Tìm kiếm được {this.state.listSearch.length} sản phẩm với từ khóa "{localStorage.getItem('keysearch')}"</h2>
                        </div>
                        <div className="row">
                            <div className="feartured-carousel">
                                {this.state.listSearch.map(function (item, index) {
                                    return <Product key={index} name={item.name} costs={item.costs}
                                        image={item.image.image1} id={item._id} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
	}
}

const Search = connect(function(state){  
})(SearchProduct)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Search/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("searchpage")
)