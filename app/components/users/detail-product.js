import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import {FacebookShareButton,GoogleButton} from 'react-social-buttons';
import Viewer from 'react-viewer';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
var {Provider} = require("react-redux");
var store = require("../../store");
import {connect} from 'react-redux'
var main,chooseColor="",firstColor,firstSize;
import ReactGA from 'react-ga'
import ReactStars from 'react-rating-stars-component'
function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
function formatCurrency(cost){
    return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
class RequireAuthentication extends React.Component{
	constructor(props){
		super(props);
		this.goAuthen = this.goAuthen.bind(this);
	}
	goAuthen(){
        console.log("go");
	}
	render(){
        console.log("nè"+window.location.href);
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
                if (data==""){
                    window.location.replace("/");
                } else {
                    main.setState({nameproduct:data.name});
                    that.setState({product:data,curcost:data.costs[data.costs.length-1].cost,cursize:data.sizes[0].size});
                }
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
        var chose = false;
        var htmlSize=[],htmlColor=[];
        if (this.state.product.sizes) {
            this.state.product.sizes.forEach(e => {
                var size = <option value={e.size}>{e.size}</option>
                htmlSize.push(size);
                if (e.size == this.state.cursize) {
                    for (var i=0; i<e.colors.length; i++){
                        if (e.colors[i].quanty > 0 && chose==false) {
                            firstColor = e.colors[i].color;
                            chose=true;
                        }
                        var status=false;
                        if (e.colors[i].quanty==0)  status=true;
                        var color = <div><label>
                            <input type="radio" name="optionColor" value={e.colors[i].color} disabled={status}/>{e.colors[i].color}</label>
                            <br/></div>
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
        var cost = formatCurrency(this.state.curcost);
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
                            <a class="fancybox" href={this.state.product.image.image2} data-fancybox-group="gallery"><span class="btn large-btn">Phóng to <i class="fa fa-search-plus"></i></span></a>
                        </div>	
                    </div>
                    <div class="tab-pane" id="thumbnail_3">
                        <div class="single-product-image">
                            <img src={this.state.product.image.image3} alt="single-product-image" />
                            <a class="fancybox" href={this.state.product.image.image3} data-fancybox-group="gallery"><span class="btn large-btn">Phóng to <i class="fa fa-search-plus"></i></span></a>
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
                {/* <div class="single-product-social-share">
                    <div id="buttons">
                    <FacebookShareButton url={url} />
                    </div>  
                </div> */}
                <div class="single-product-price">
                    <h2>{cost}</h2>
                </div>
                <div class="single-product-desc">
                    <h4><b>Mô tả sản phẩm:</b></h4>
                    <p>{this.state.product.description}</p>
                    {this.state.product.quanty<=5 ? <p class="notify-product"><b>Chỉ còn {this.state.product.quanty} sản phẩm</b></p> :
                    <p>Có sẵn {this.state.product.quanty} sản phẩm</p>}
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
            </div>
        </div>
    </div>)
    }
}
var infor;
var constImage = "/img/product/default.png";
var image1, image2, image3;
class CommentBox extends React.Component {
    constructor(props){
        super(props);
        this.handleComment = this.handleComment.bind(this);
        this.state = {
            image1: constImage,
            image2: constImage,
            image3: constImage,
            addImage: false
        }
        this.changeStatus = this.changeStatus.bind(this);
        this.ChangeImage1 = this.ChangeImage1.bind(this);
        this.ChangeImage2 = this.ChangeImage2.bind(this);
        this.ChangeImage3 = this.ChangeImage3.bind(this);
        this.handleImage = this.handleImage.bind(this);
    }
    handleComment(){
        var comment = this.refs.yourComment.value;
        var that = this;
        $.post("/addComment",{idProduct: localStorage.getItem('curproduct'),content:comment,
        image1: this.state.image1, image2: this.state.image2, image3: this.state.image3,
        username: localStorage.getItem("username")},function(data){
            document.getElementById("taComment").value = "";
            infor.setState({listComment:data});
            that.setState({image1:constImage, image2: constImage, image3: constImage, addImage:false});
        })
    }
    handleImage(image){
        let imageFormObj = new FormData();
        imageFormObj.append("imageName","multer-image"+Date.now());
        imageFormObj.append("imageData",image);
        return new Promise((resolve,reject)=>{
            $.ajax({
                type: "POST",
                url: "/uploadImageComment",
                data: imageFormObj,
                processData: false,
                contentType: false,
                success: function (data) {
                    return (resolve("/img/comments/"+data));
                },
                fail: function(err) {
                    return (reject(new Error(err)));
                }
            })
        })
    }
    ChangeImage1(e){
        var that = this;
        image1 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image1}, function (data) {
            if (data == 1) {
                that.handleImage(image1).then(res => that.setState({image1:res}), err => console.log(err));
            }
        })  
    }
    ChangeImage2(e){
        var that = this;
        image2 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image2}, function (data) {
            if (data == 1) {
                that.handleImage(image2).then(res => that.setState({image2:res}), err => console.log(err));
            }
        })  
    }
    ChangeImage3(e){
        var that = this;
        image3 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image3}, function (data) {
            if (data == 1) {
                that.handleImage(image3).then(res => that.setState({image3:res}), err => console.log(err));
            }
        })  
    }
    changeStatus(){
        this.setState({addImage:!this.state.addImage});
}
    render(){
        return (<div class="yourComment">
            <textarea placeholder="Bạn đánh giá thế nào về sản phẩm?" class="urTextComment" rows="3" ref="yourComment" id="taComment">
            </textarea>
            { this.state.addImage==false ? <button class="btn btn-default btnImage" onClick={this.changeStatus}>Thêm hình ảnh</button> :
                <div><button class="btn btn-default btnImage" onClick={this.changeStatus}>Ẩn hình ảnh</button>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 imageDivComment">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image1} ref="image1" width="80%" />
                        <label>Image 1:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage1(e)} required />
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image2} ref="image2" width="80%" />
                        <label>Image 2:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage2(e)} />
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image3} ref="image3" width="80%" />
                        <label>Image 3:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage3(e)} />
                    </div>
                </div>
                </div>}
            <button class="postComment btn btn-primary" onClick={this.handleComment}>Bình luận</button>
        </div>)
    }
}
var display;
class DisplayImage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            pos:0
        }
        this.setVisible = this.setVisible.bind(this);
        this.setDisable = this.setDisable.bind(this);
        display=this;
    }
    setVisible(index){
        console.log(this.props.listImage);
        this.setState({visible:true, pos:index});
    }
    setDisable(){
        this.setState({visible:false})
    }
    render(){
        var that = this;
        return (
            <div>
                {this.props.listImage.map(function (image, index) {
                    return (<img src={image.src} width="20%" onClick={() => that.setVisible(index)}/>)
                })}
              <Viewer
              visible={this.state.visible}
              onClose={this.setDisable }
              images={this.props.listImage}
              activeIndex={this.state.pos}
              zIndex="100000"
              />
            </div>
          );
    }
}
class SingleComment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showResponse: false
        }
        this.displayResponse = this.displayResponse.bind(this);
    }
    displayResponse(){
        this.setState({showResponse:!this.state.showResponse});
    }
    render(){
        var list=[];
        if (this.props.comment.images)
        list = this.props.comment.images.map(image => ({src:image.image,alt:''}));
        return(<div>
            <div class="singleComment">
                <h4 style={{ fontWeight: "700", color: "blue" }}>{this.props.comment.username}
                    <span style={{ color: "black" }}> : {this.props.comment.date}</span>
                </h4>
                <div class="contentComment">
                    <p class="textComment">{this.props.comment.content}</p>
                </div>
                {this.props.comment.images.length > 0 ?
                    <div class="displayImage">
                        <DisplayImage listImage={list}/>
                    </div> : <div></div>
                }
                <a class="response" onClick={this.displayResponse}>{this.props.comment.responses.length>0?"Đã phản hồi"
                :""}
                </a>
            </div>
            {this.state.showResponse==true ? 
            this.props.comment.responses.length > 0 ?
                this.props.comment.responses.map(function (response, index) {
                    return (<div class="singleAdReponse">
                        <div class="divComment">
                            <h4 style={{ fontWeight: "700", color: "red" }}>ADMIN
                            <span style={{ color: "black" }}> : {response.date}</span>
                            </h4>
                            <div class="contentComment">
                                <p class="textComment">{response.content}</p>
                            </div>
                            {response.images.length > 0 ?
                                <div class="displayImage">
                                    <DisplayImage listImage={response.images.map(image => ({src:image.image,alt:''}))}/>
                                </div> : <div></div>
                            }
                        </div></div>)
                }) : <div></div> : <div></div>}
        </div>)
    }
}
var valueStar = 0;
class InforProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listComment: [],
            ratingSuccess: false,
            dataRating: [{value:0,percent:0},{value:0,percent:0},{value:0,percent:0},
                {value:0,percent:0},{value:0,percent:0}],
            done:true
        }
        infor = this;
        this.evaluate = this.evaluate.bind(this);
        this.ratingChanged = this.ratingChanged.bind(this);
    }
    componentDidMount(){
        var that = this;
        $.post("/showComment",{idProduct: localStorage.getItem('curproduct')},function(data){
            that.setState({listComment:data});
        });
        var id = localStorage.getItem("curproduct");
        var email = localStorage.getItem('email');
        $.post("/getRating",{id:id, email:email}, function(data){
            that.setState({dataRating:data.data, done:data.done});
        })
    }
    ratingChanged(value){
        valueStar = value;
    }
    evaluate(){
        var that = this;
        var email = localStorage.getItem("email");
        var id = localStorage.getItem("curproduct");
        $.post("/ratingStar",{value: valueStar, id: id, email:email},function(data){
            that.setState({ratingSuccess:true});
            $.post("/getRating",{id:id}, function(data){
                that.setState({dataRating:data.data,done:true});
            })
        })
    }
    render(){
        var htmlComment = "";
        if (localStorage.getItem("token")){
            htmlComment = <CommentBox/>
        }
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
                            <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 padding-5 col-md-push-1">
                                    <div>
                                        <div class="side">
                                            <div>5 sao</div>
                                        </div>
                                        <div class="middle">
                                            <div class="bar-container">
                                                <div class="bar-5" style={{width: this.state.dataRating[4].percent+"%"}}></div>
                                            </div>
                                        </div>
                                        <div class="side right">
                                            <div>{this.state.dataRating[4].value}</div>
                                        </div>
                                        <div class="side">
                                            <div>4 sao</div>
                                        </div>
                                        <div class="middle">
                                            <div class="bar-container">
                                                <div class="bar-4" style={{width: this.state.dataRating[3].percent+"%"}}></div>
                                            </div>
                                        </div>
                                        <div class="side right">
                                            <div>{this.state.dataRating[3].value}</div>
                                        </div>
                                        <div class="side">
                                            <div>3 sao</div>
                                        </div>
                                        <div class="middle">
                                            <div class="bar-container">
                                                <div class="bar-3" style={{width: this.state.dataRating[2].percent+"%"}}></div>
                                            </div>
                                        </div>
                                        <div class="side right">
                                            <div>{this.state.dataRating[2].value}</div>
                                        </div>
                                        <div class="side">
                                            <div>2 sao</div>
                                        </div>
                                        <div class="middle">
                                            <div class="bar-container">
                                                <div class="bar-2" style={{width: this.state.dataRating[1].percent+"%"}}></div>
                                            </div>
                                        </div>
                                        <div class="side right">
                                            <div>{this.state.dataRating[1].value}</div>
                                        </div>
                                        <div class="side">
                                            <div>1 sao</div>
                                        </div>
                                        <div class="middle">
                                            <div class="bar-container">
                                                <div class="bar-1" style={{width: this.state.dataRating[0].percent+"%"}}></div>
                                            </div>
                                        </div>
                                        <div class="side right">
                                            <div>{this.state.dataRating[0].value}</div>
                                        </div>
                                    </div>
                                    {(localStorage.getItem("token")&&this.state.done==false) ? 
                                    <div class="tab-rating-box">
                                        <span>Bạn chưa đánh giá?</span>
                                        <ReactStars
                                            count={5}
                                            onChange={this.ratingChanged}
                                            size={30}
                                            half={false}
                                            color2={'#ffd700'} />
                                        <a class="write-review-btn" style={{ cursor: "pointer" }} onClick={this.evaluate}>Đánh giá</a>
                                    </div> : <div></div>}
                                {this.state.ratingSuccess==true ? <div class="alert alert-success thanhcong">
                                            <strong>Đánh giá thành công!</strong>
                                        </div>	: <div></div>}		
                            </div>
                        </div>
                        
                        <div class="row">
                                <div class="comment">
                                    <h3>BÌNH LUẬN</h3>
                                    {htmlComment}
                                    <h3>Tất cả bình luận <span style={{ color: 'red', fontWeight: '700' }}>({this.state.listComment.length})</span></h3>
                                    {this.state.listComment.map(function (comment, index) {
                                        return (<SingleComment key={index} comment={comment} />)
                                    })}
                                </div>
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
        var cost = formatCurrency(this.props.costs[this.props.costs.length-1].cost)
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
                    <span class="price">{cost}</span>
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
            socket.emit("require-update-view-product","");
        });
        var email = localStorage.getItem('email');
        $.post("/updateTopCategory",{idProduct:idProduct,email:email});
    }
    render(){     
        initizeAnalytics();  
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
