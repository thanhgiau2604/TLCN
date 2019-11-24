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
class DetailProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            product:{image: {image1:""}}
        }
        this.addToCart = this.addToCart.bind(this);
    }
    componentDidMount(){
        var idproduct = localStorage.getItem('curproduct');
        var that = this;
        $.post("/getDetailProduct",{idproduct:idproduct},function(data){
            console.log(data);
            that.setState({product:data});
        })
    }
    addToCart(){
        $.post("/addToCart",{id:localStorage.getItem('curproduct'),email:localStorage.getItem('email')},function(data){
			var {dispatch} = main.props;
        	dispatch({type:"UPDATE_PRODUCT",newcart:data});
		})
    }
    render(){
        return(<div class="row">
        <div class="col-lg-5 col-md-5 col-sm-4 col-xs-12">
            <div class="single-product-view">
                <div class="tab-content">
                    <div class="tab-pane active" id="thumbnail_1">
                        <div class="single-product-image">
                            <img src={this.state.product.image.image1} alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href={this.state.product.image.image1} data-fancybox-group="gallery"><span class="btn large-btn">Phóng to <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_2">
                        <div class="single-product-image">
                            <img src="img/product/sale/3.jpg" alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href="img/product/sale/3.jpg" data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_3">
                        <div class="single-product-image">
                            <img src="img/product/sale/9.jpg" alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href="img/product/sale/9.jpg" data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_4">
                        <div class="single-product-image">
                            <img src="img/product/sale/13.jpg" alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href="img/product/sale/13.jpg" data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_5">
                        <div class="single-product-image">
                            <img src="img/product/sale/7.jpg" alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href="img/product/sale/7.jpg" data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_6">
                        <div class="single-product-image">
                            <img src="img/product/sale/12.jpg" alt="single-product-image" />
                            <a class="new-mark-box" href="#">new</a>
                            <a class="fancybox" href="img/product/sale/12.jpg" data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                </div>										
            </div>
            <div class="select-product">
                <ul class="nav nav-tabs select-product-tab bxslider">
                    <li class="active">
                        <a href="#thumbnail_1" data-toggle="tab"><img src="img/product/treem-1.jpg" alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_2" data-toggle="tab"><img src="img/product/sidebar_product/2.jpg" alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_3" data-toggle="tab"><img src="img/product/sidebar_product/3.jpg" alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_4" data-toggle="tab"><img src="img/product/sidebar_product/4.jpg" alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_5" data-toggle="tab"><img src="img/product/sidebar_product/5.jpg" alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_6" data-toggle="tab"><img src="img/product/sidebar_product/6.jpg" alt="pro-thumbnail" /></a>
                    </li>
                </ul>										
            </div>
        </div>
        <div class="col-lg-7 col-md-7 col-sm-8 col-xs-12">
            <div class="single-product-descirption">
                <h2>{this.state.product.name}</h2>
                <div class="single-product-social-share">
                    <ul>
                        <li><a href="#" class="fb-link"><i class="fa fa-facebook"></i>Facebook</a></li>
                        <li><a href="#" class="g-plus-link"><i class="fa fa-google-plus"></i>Google+</a></li>
                    </ul>
                </div>
                <div class="single-product-review-box">
                    <div class="rating-box">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star-half-empty"></i>
                    </div>
                    <div class="read-reviews">
                        <a href="#">Xem đánh giá (1)</a>
                    </div>
                    <div class="write-review">
                        <a href="#">Đánh giá</a>
                    </div>		
                </div>
                <div class="single-product-price">
                    <h2>{this.state.product.cost}đ</h2>
                </div>
                <div class="single-product-desc">
                    <h4>Mô tả sản phẩm:</h4>
                    <p>{this.state.product.description}</p>
                </div>
                <div class="single-product-info">
                    <a href="#"><i class="fa fa-heart"></i></a>
                </div>
                <div class="single-product-quantity">
                    <p class="small-title">Số lượng</p> 
                    <div class="cart-quantity">
                        <div class="cart-plus-minus-button single-qty-btn">
                            <input class="cart-plus-minus sing-pro-qty" type="text" name="qtybutton" value="0"/>
                        </div>
                    </div>
                </div>
                <div class="single-product-size">
                    <p class="small-title">Size </p> 
                    <select name="product-size" id="product-size">
                        <option value="">39</option>
                        <option value="">40</option>
                        <option value="">41</option>
                        <option value="">42</option>
                    </select>
                </div>
                <div class="single-product-color">
                    <p class="small-title">Màu sắc </p> 
                    <a href="#"><span></span></a>
                    <a class="color-blue" href="#"><span></span></a>
                </div>
                <div class="single-product-add-cart">
                    <a class="add-cart-text" title="Add to cart" style={{cursor:'pointer'}}
                    onClick={this.addToCart}>Thêm vào giỏ hàng</a>
                </div>
            </div>
        </div>
    </div>)
    }
}
class InforProduct extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div class="row">
        <div class="col-sm-12">
            <div class="product-more-info-tab">
                <ul class="nav nav-tabs more-info-tab">
                    <li class="active"><a href="#moreinfo" data-toggle="tab">Thông tin</a></li>
                    <li><a href="#review" data-toggle="tab">Đánh giá</a></li>
                </ul>             
                <div class="tab-content">
                    <div class="tab-pane active" id="moreinfo">
                        <div class="tab-description">
                            <p>Fashion has been creating well-designed collections since 2010. The brand offers feminine designs delivering stylish separates and statement dresses which have since evolved into a full ready-to-wear collection in which every item is a vital part of a woman's wardrobe. The result? Cool, easy, chic looks with youthful elegance and unmistakable signature style. All the beautiful pieces are made in Italy and manufactured with the greatest attention. Now Fashion extends to a range of accessories including shoes, hats, belts and more!</p>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="review">
                        <div class="row tab-review-row">
                            <div class="col-xs-5 col-sm-4 col-md-4 col-lg-3 padding-5">
                                <div class="tab-rating-box">
                                    <span>Sao</span>
                                    <div class="rating-box">
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star-half-empty"></i>
                                    </div>	
                                    <div class="review-author-info">
                                        <span>06/22/2015</span>
                                    </div>															
                                </div>
                            </div>
                            <div class="col-xs-7 col-sm-8 col-md-8 col-lg-9 padding-5">
                                <div class="write-your-review">
                                    <p><strong>Viết đánh giá</strong></p>
                                    <p>write A REVIEW</p>
                                    <a href="#">Report abuse </a>
                                </div>
                            </div>
                            <a href="#" class="write-review-btn">Đánh giá của bạn!</a>
                        </div>
                    </div>
                </div>									
            </div>
        </div>
    </div>)
    }
}

class SingleHistory extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<li>
            <a href="#"><img src={this.props.image} /></a>
            <div class="r-sidebar-pro-content">
                <h5><a href="#">{this.props.name}</a></h5>
                <p>{this.props.description}</p>
            </div>
        </li>)
    }
}
class HistoryProduct extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listHistory:[]
        }
    } 
    componentDidMount(){
        var that = this;
        var idproduct = localStorage.getItem('curproduct');
        console.log(idproduct+" "+localStorage.getItem('email'));
        $.post("/updateProductHistory",{email:localStorage.getItem('email'),idproduct:idproduct},function(data){
            if (data){
                var arrView = data.slice(0,5);
                console.log(arrView);
                that.setState({listHistory:arrView});
            }
        })
    }
    render(){
        return(<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
        <div class="single-product-right-sidebar">
            <h2 class="left-title">SẢN PHẨM ĐÃ XEM</h2>
            <ul>
                {this.state.listHistory.map(function(pro,index){
                    return <SingleHistory key={index} id={pro._id} name={pro.name} image={pro.image.image1}
                    description={pro.description} />
                })}
            </ul>
        </div>							
        <div class="single-product-right-sidebar">
            <div class="slider-right zoom-img">
                <a href="#"><img class="img-responsive" src="img/product/cms11.jpg" alt="sidebar left" /></a>
            </div>							
        </div>
    </div>)
    }
}

class SingleRelate extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
        <div class="item">
        <div class="single-product-item">
            <div class="product-image">
                <a href="#"><img src={this.props.image} alt="product-image" /></a>
            </div>
            <div class="product-info">
                <div class="customar-comments-box">
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
                <a href="#">{this.props.name}</a>
                <div class="price-box">
                    <span class="price">{this.props.cost}đ</span>
                </div>
            </div>
        </div>							
    </div></div>)
    }
}
class RelatedProduct extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listRelate:[]
        }
    } 
    componentDidMount(){
        var that = this;
        $.post("/getProductRelate",{idproduct:localStorage.getItem('curproduct')},function(data){
            console.log(data);
            that.setState({listRelate:data});
        })
    } 
    render(){
        return(<div class="row">
        <div class="col-sm-12">
            <div class="left-title-area">
                <h2 class="left-title">SẢN PHẨM LIÊN QUAN</h2>
            </div>	
        </div>
        <div class="related-product-area featured-products-area">
            <div class="col-sm-12">
                <div class=" row">                
                    <div class="related-product">
                        {this.state.listRelate.map(function(pro,index){
                            return <SingleRelate key={index} id={pro._id}
                            name={pro.name} image={pro.image.image1} cost={pro.cost}/>
                        })}																				
                    </div>
                </div>	
            </div>
        </div>	
    </div>)
    }
}

class TotalPage extends React.Component{
    constructor(props){
        super(props);
        main = this;
    }
    render(){
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="index-2.html">Trang chủ<span><i class="fa fa-caret-right"></i> </span> </a>
                        <span> <i class="fa fa-caret-right"> </i> </span>
                        <a href="shop-gird.html">Giày nữ</a>
                        <span> Faded Short Sleeves T-shirt </span>
                    </div>               
                </div>
            </div>				
            <div class="row">
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                    <DetailProduct/>
                    <InforProduct/>
                    <RelatedProduct/>
                </div>
                <HistoryProduct/>			
            </div>
        </div>
    </section>)
    }   
}
const Page = connect(function(state){  
})(TotalPage)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Page/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("detail-product")
)
