import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import {FacebookShareButton,GoogleButton} from 'react-social-buttons';

var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'
var main,chooseColor="",firstColor;
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
class DetailProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            product:{image: {image1:"",image2:"",image3:""}},
            curcost:0,
            cursize:0,
            isFavorite: false
        }
        this.addToCart = this.addToCart.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handleFavorite = this.handleFavorite.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }
    handleFavorite(){
		const token = localStorage.getItem('token');
		var that = this;
		if (!token) {
			$("#modal-authen").modal('show');
		} else {
            $.post("/addToFavorite", { id: this.state.product._id, email: localStorage.getItem('email') }, function (data) {
                that.setState({ isFavorite: true });
            });
		}
    }
    handleRemove(){
        var that = this;
        $.post("/deleteFav", { idDel: this.state.product._id, email: localStorage.getItem('email') }, function (data) {
            that.setState({isFavorite: false});
        })
    }
    componentDidMount(){
        var idproduct = localStorage.getItem('curproduct');
        var that = this;
        if (idproduct){
            $.post("/getDetailProduct",{idproduct:idproduct},function(data){
                console.log(data);
                main.setState({nameproduct:data.name});
                that.setState({product:data,curcost:data.costs[data.costs.length-1].cost,cursize:data.sizes[0].size});
            })
            $.post("/checkFavorite", { idProduct: idproduct, email: localStorage.getItem('email')}, function (data) {
				if (data == 1) {
					that.setState({ isFavorite: true });
				}
			})
        }
    }
    addToCart(){
        const email = localStorage.getItem('email');
        var color = chooseColor;
        if (color=="") color=firstColor;
        const size = this.refs.size.value;
        const token = localStorage.getItem('token');
		if (!token){
			$("#modal-authen").modal('show');
		} else {
			$.post("/addToCart",{id:localStorage.getItem('curproduct'),quanty:this.quanty.value,email:email,
            color:color, size:size},function(data){
				var {dispatch} = main.props;
				dispatch({type:"UPDATE_PRODUCT",newcart:data});
			})
		}
    }
    changeSize(e){
        var size = parseInt(e.target.value);
        this.setState({cursize:size});
    }
    changeColor(e){
        chooseColor = e.target.value;
    }
    render(){
        var url = window.location.href;
        var htmlSize=[],htmlColor=[];
        if (this.state.product.sizes) {
            this.state.product.sizes.forEach(e => {
                var size = <option value={e.size}>{e.size}</option>
                htmlSize.push(size);
                if (e.size == this.state.cursize) {
                    for (var i=0; i<e.colors.length; i++){
                        if (i==0) firstColor = e.colors[0].color;
                        var color = <div><label><input type="radio" name="optionColor" value={e.colors[i].color}/>{e.colors[i].color}</label><br/></div>
                        htmlColor.push(color);
                    }
                }
            });
        }
        var buttonFavorite;
        if (this.state.isFavorite==true){
            buttonFavorite = <button className='text-center btn btn-danger' onClick={this.handleRemove}><i className='fa fa-trash' style={{paddingRight:'5px'}}></i>Xóa khỏi danh sách yêu thích</button>;
        } else {
            buttonFavorite = <button className='text-center btn btn-success' onClick={this.handleFavorite}><i className='fa fa-heart' style={{paddingRight:'5px'}}></i>Thêm vào danh sách yêu thích</button>;
        }
        return(<div class="row">
        <div class="col-lg-5 col-md-5 col-sm-4 col-xs-12">
            <div class="single-product-view">
                <div class="tab-content">
                    <div class="tab-pane active" id="thumbnail_1">
                        <div class="single-product-image">
                            <img src={this.state.product.image.image1} alt="single-product-image" />
                            <a class="fancybox" href={this.state.product.image.image1} data-fancybox-group="gallery"><span class="btn large-btn">Phóng to <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_2">
                        <div class="single-product-image">
                            <img src={this.state.product.image.image2} alt="single-product-image" />
                            <a class="fancybox" href={this.state.product.image.image2} data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_3">
                        <div class="single-product-image">
                            <img src={this.state.product.image.image3} alt="single-product-image" />
                            <a class="fancybox" href={this.state.product.image.image3} data-fancybox-group="gallery"><span class="btn large-btn">View larger <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                </div>										
            </div>
            <div class="select-product">
                <ul class="nav nav-tabs select-product-tab bxslider">
                    <li class="active">
                        <a href="#thumbnail_1" data-toggle="tab"><img src={this.state.product.image.image1} alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_2" data-toggle="tab"><img src={this.state.product.image.image2} alt="pro-thumbnail" /></a>
                    </li>
                    <li>
                        <a href="#thumbnail_3" data-toggle="tab"><img src={this.state.product.image.image3} alt="pro-thumbnail" /></a>
                    </li>
                </ul>										
            </div>
        </div>
        <div class="col-lg-7 col-md-7 col-sm-8 col-xs-12">
            <div class="single-product-descirption">
                <h2>{this.state.product.name}</h2>
                <div class="single-product-social-share">
                    <div id="buttons">
                    <FacebookShareButton url={url} />
                    </div>  
                </div>
                {/* <div class="single-product-review-box">
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
                </div> */}
                <div class="single-product-price">
                    <h2>{this.state.curcost}đ</h2>
                </div>
                <div class="single-product-desc">
                    <h4>Mô tả sản phẩm:</h4>
                    <p>{this.state.product.description}</p>
                </div>
                <div class="single-product-info">
                    {buttonFavorite}
                </div>
                <div class="single-product-quantity">
                    <p class="small-title">Số lượng</p> 
                    <div class="cart-quantity">
                        <div class="cart-plus-minus-button single-qty-btn">
                            <input class="cart-plus-minus sing-pro-qty" type="text" name="qtybutton" value="1" ref={(data) => { this.quanty = data; }}/>
                        </div>
                    </div>
                </div>
                <div class="single-product-size">
                    <p class="small-title">Size </p> 
                    <select name="product-size" id="product-size" ref="size" onChange={this.changeSize}>
                        {htmlSize}
                    </select>
                </div>
                <div class="single-product-color">
                    <p class="small-title">Màu sắc </p> 
                    <div class="radio" ref='color' onChange={this.changeColor}>
                        {htmlColor}
                    </div>
                </div>
                <div class="single-product-add-cart">
                    <a class="add-cart-text" title="Add to cart" style={{cursor:'pointer'}}
                    onClick={this.addToCart}>Thêm vào giỏ hàng</a>
                </div>
                <RequireAuthentication/>
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
        this.getDetail = this.getDetail.bind(this);
    }
    getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
	}
    render(){
        return(<li>
            <a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} /></a>
            <div class="r-sidebar-pro-content">
                <h5><a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a></h5>
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
        this.getDetail = this.getDetail.bind(this);
    }
    getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
	}
    render(){
        return(<div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
        <div class="item">
        <div class="single-product-item">
            <div class="product-image">
                <a style={{cursor:'pointer'}} onClick={this.getDetail}><img src={this.props.image} alt="product-image" /></a>
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
                <a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
                <div class="price-box">
                    <span class="price">{this.props.costs[this.props.costs.length-1].cost}đ</span>
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
                            name={pro.name} image={pro.image.image1} costs={pro.costs}/>
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
        this.state = {
            nameproduct:""
        }
    }
    componentDidMount(){
        var idProduct = localStorage.getItem('curproduct');
        $.post("/updateCountView",{idProduct:idProduct},function(data){

        })
    }
    render(){       
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ<span><i class="fa fa-caret-right"></i> </span> </a>
                        <span>{this.state.nameproduct}</span>
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
