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
var main;

class ProductGird extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<li class="gategory-product-list col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div class="single-product-item">
            <div class="product-image">
                <a href="single-product.html"><img src={this.props.image} alt="product-image" /></a>
                <a href="single-product.html" class="new-mark-box">sale!</a>
                <div class="overlay-content">
                    <ul>
                        <li><a href="#" title="Quick view"><i class="fa fa-search"></i></a></li>
                        <li><a href="#" title="Quick view"><i class="fa fa-shopping-cart"></i></a></li>
                        <li><a href="#" title="Quick view"><i class="fa fa-retweet"></i></a></li>
                        <li><a href="#" title="Quick view"><i class="fa fa-heart-o"></i></a></li>
                    </ul>
                </div>
            </div>
            <div class="product-info">
                <div class="customar-comments-box">
                    <div class="rating-box">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star-half-empty"></i>
                        <i class="fa fa-star-half-empty"></i>
                    </div>
                    <div class="review-box">
                        <span>1 Review(s)</span>
                    </div>
                </div>
                <a href="single-product.html">{this.props.name}</a>
                <div class="price-box">
                    <span class="price">{this.props.cost}</span>
                    <span class="old-price"></span>
                </div>
            </div>
        </div>									
    </li>)
    }
}

class ProductList extends React.Component{
    constructor(props){
        super(props);
        
    }
    render(){
        return(<li class="cat-product-list">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div class="single-product-item">
                <div class="product-image">
                    <a href="single-product.html"><img src="img/product/sale/3.jpg" alt="product-image" /></a>
                    <a href="single-product.html" class="new-mark-box">new</a>
                </div>
            </div>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <div class="list-view-content">
                <div class="single-product-item">
                    <div class="product-info">
                        <div class="customar-comments-box">
                            <a href="single-product.html">Faded Short Sleeves T-shirt </a>
                            <div class="rating-box">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star-half-empty"></i>
                            </div>
                            <div class="review-box">
                                <span>1 Review(s)</span>
                            </div>
                        </div>
                        <div class="product-datails">
                            <p>Faded short sleeves t-shirt with high neckline. Soft and stretchy material for a comfortable fit. Accessorize with a straw hat and you're ready for summer! </p>
                        </div>
                        <div class="price-box">
                            <span class="price">$16.51</span>
                        </div>
                    </div>
                    <div class="overlay-content-list">
                        <ul>
                            <li><a href="#" title="Add to cart" class="add-cart-text">Thêm vào giỏ hàng</a></li>
                            <li><a href="#" title="Quick view"><i class="fa fa-search"></i></a></li>
                            <li><a href="#" title="Add to compare"><i class="fa fa-retweet"></i></a></li>
                            <li><a href="#" title="Add to wishlist"><i class="fa fa-heart-o"></i></a></li>
                        </ul>
                    </div>												
                </div>														
            </div>
        </div>
    </li>)
    }
}

class OptionProduct extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">      
        <div class="product-left-sidebar">
            <h2 class="left-title pro-g-page-title">LỌC SẢN PHẨM</h2>
            <div class="product-single-sidebar">
                <span class="sidebar-title">Điều kiện</span>
                <ul>
                    <li>
                        <label class="cheker">
                            <input type="checkbox" name="condition"/>
                            <span></span>
                        </label>
                        <a href="#">mới<span> (13)</span></a>
                    </li>
                </ul>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">Giá</span>
                <ul>
                    <li> 
                        <label><strong>Khoảng giá:</strong><input type="text" id="slidevalue" /></label>
                    </li>
                    <li>
                        <div id="price-range"></div>	
                    </li>
                </ul>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">MÀU SẮC</span>
                <ul class="product-color-var">
                    <li>
                        <i class="fa fa-square color-beige"></i>
                        <a href="#">Xám<span> (1)</span></a>
                    </li>
                    <li>
                        <i class="fa fa-square color-white"></i>
                        <a href="#">Trắng<span> (2)</span></a>
                    </li>	
                    <li>
                        <i class="fa fa-square color-black"></i>
                        <a href="#">Đen<span> (2)</span></a>
                    </li>									
                    <li>
                        <i class="fa fa-square color-orange"></i>
                        <a href="#">Cam<span> (5)</span></a>
                    </li>
                    <li>
                        <i class="fa fa-square color-blue"></i>
                        <a href="#">Xanh<span> (8)</span></a>
                    </li>
                    <li>
                        <i class="fa fa-square color-green"></i>
                        <a href="#">Lục<span> (3)</span></a>
                    </li>
                    <li>
                        <i class="fa fa-square color-yellow"></i>
                        <a href="#">Vàng<span> (4)</span></a>
                    </li>
                    <li>
                        <i class="fa fa-square color-pink"></i>
                        <a href="#">Hồng<span> (6)</span></a>
                    </li>
                </ul>
            </div>
            
        </div>
        <div class="product-left-sidebar">
            <h2 class="left-title">Tags </h2>
            <div class="category-tag">
                <a href="#">fashion</a>
                <a href="#">handbags</a>
                <a href="#">women</a>
                <a href="#">men</a>
                <a href="#">kids</a>
                <a href="#">New</a>
                <a href="#">Accessories</a>
                <a href="#">clothing</a>
                <a href="#">New</a>
            </div>
        </div>
    </div>)
    }
}

class OptionView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div class="product-shooting-bar">
        <div class="shoort-by">
            <label for="productShort">Sắp xếp</label>
            <div class="short-select-option">
                <select name="sortby" id="productShort">
                    <option value="">--</option>
                    <option value="">Giá: thấp - cao</option>
                    <option value="">Giá: cao - thấp</option>
                    <option value="">Tên sản phẩm: A - Z</option>
                    <option value="">Tên sản phẩm: Z - A</option>
                </select>												
            </div>
        </div>
        <div class="view-systeam">
            <label for="perPage">View:</label>
            <ul>
                <li class="active"><a href="shop-gird.html"><i class="fa fa-th-large"></i></a><br />Grid</li>
                <li><a href="shop-list.html"><i class="fa fa-th-list"></i></a><br />List</li>
            </ul>
        </div>
    </div>)
    }
}

class Category extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listProduct: [],
            category:{}
        }
    }
    componentDidMount(){
        var name = localStorage.getItem("curcategory");
        var that = this;
        $.get("/getCategoryProduct/"+name,function(data){
            that.setState({listProduct:data.lProduct,category:data.category})
        })
    }
    render(){
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="index.html">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>{this.state.category.name}</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <OptionProduct/>
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                    <div class="right-all-product">
                        <div class="product-category-header">
                            <div class="category-header-image">
                                <img src={this.state.category.image} alt="category-header" />
                                <div class="category-header-text">
                                    <h2>{this.state.category.name}</h2>
                                </div>									
                            </div>
                        </div>
                        <div class="product-category-title">
                            <h1>
                                <span class="cat-name">{this.state.category.name}</span>
                                <span class="count-product">Có 13 sản phẩm</span>
                            </h1>
                        </div>
                        <div class="product-shooting-area">
                            <OptionView/>
                            <div class="product-shooting-result">
                                
                                <div class="showing-item">
                                    <span>Hiển thị 1 - 12 trong 13 sản phẩm</span>
                                </div>
                                <div class="showing-next-prev">
                                    <ul class="pagination-bar">
                                        <li class="disabled">
                                            <a href="#" ><i class="fa fa-chevron-left"></i>Previous</a>
                                        </li>
                                        <li class="active">
                                            <span><a class="pagi-num" href="#">1</a></span>
                                        </li>
                                        <li>
                                            <span><a class="pagi-num" href="#">2</a></span>
                                        </li>
                                        <li>
                                            <a href="#" >Next<i class="fa fa-chevron-right"></i></a>
                                        </li>
                                    </ul>
                                    <form action="#">
                                        <button class="btn showall-button">Hiển thị tất cả</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>                  
                    <div class="all-gategory-product">
                        <div class="row">
                            <ul class="gategory-product">											
                                {this.state.listProduct.map(function(pro,index){
                                    return <ProductGird key={index} name={pro.name} cost={pro.cost}
                                    image={pro.image.image1} id={pro._id}/>
                                })}
                            </ul>
                        </div>
                    </div>     
                    <div class="product-shooting-result product-shooting-result-border">
                        <div class="showing-item">
                            {/* <span>Showing 1 - 12 of 13 items</span> */}
                        </div>
                        <div class="showing-next-prev">
                            <ul class="pagination-bar">
                                <li class="disabled">
                                    <a href="#" ><i class="fa fa-chevron-left"></i>Previous</a>
                                </li>
                                <li class="active">
                                    <span><a class="pagi-num" href="#">1</a></span>
                                </li>
                                <li>
                                    <span><a class="pagi-num" href="#">2</a></span>
                                </li>
                                <li>
                                    <a href="#" >Next<i class="fa fa-chevron-right"></i></a>
                                </li>
                            </ul>
                            <form action="#">
                                <button class="btn showall-button">Show all</button>
                            </form>
                        </div>
                    </div>	
                </div>
            </div>
        </div>
    </section>)
    }
}

const Page = connect(function(state){  
})(Category)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Page/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("categoryproduct"))