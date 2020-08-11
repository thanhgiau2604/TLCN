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
var main,choosePrice=0,chooseSize=0,chooseColor="all",listAllProduct;
import ReactGA from 'react-ga'
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
class ProductGird extends React.Component{
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
            const thisSize = this.props.size[0].size;
			const thisColor= this.props.size[0].colors[0].color;
            $.post("/addToCart",{id:this.props.id,email:localStorage.getItem('email'),
            color: thisColor, size:thisSize},function(data){
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
			$.post("/checkFavorite", {idProduct: this.props.id, email:email }, function (data) {
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
        return(<li class="gategory-product-list col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div class="single-product-item">
            <div class="product-image">
            <a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
                <div class="overlay-content">
                        <ul>
                            <li><a title="Xem sản phẩm" style={{ cursor: 'pointer' }} onClick={this.getDetail}><i className="fa fa-search"></i></a></li>
                            <li><a title="Thêm vào giỏ hàng" style={{ cursor: 'pointer' }} onClick={this.addToCart}><i className="fa fa-shopping-cart"></i></a></li>
                            <li><a title="Quick view" style={{ cursor: 'pointer' }}><i className="fa fa-retweet"></i></a></li>
                            {htmlFavorite}
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
                    {this.props.comments.length>0?<span>{this.props.comments.length} bình luận</span> :<span></span>}
                    </div>
                </div>
                <a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
                <div class="price-box">
                    <span class="price">{cost}</span>
                    <span class="old-price"></span>
                </div>
                <RequireAuthentication/>
            </div>
        </div>									
    </li>)
    }
}

class ProductList extends React.Component{
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
		window.location.assign("/detailproduct");
    }
    addToCart(){
        console.log("vô");
		const token = localStorage.getItem('token');
		if (!token){
			$("#modal-authen").modal('show');
		} else {
            const thisSize = this.props.size[0].size;
			const thisColor= this.props.size[0].colors[0].color;
            $.post("/addToCart",{id:this.props.id,email:localStorage.getItem('email'),
            color: thisColor, size:thisSize},function(data){
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
			htmlFavorite=<li><a title="Xóa khỏi favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o" style={{color:'#ff5858'}}></i></span></a></li>
		} else {
			htmlFavorite=<li><a title="Thêm vào favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o"></i></span></a></li>
        }
        var cost = formatCurrency(this.props.costs[this.props.costs.length-1].cost)
        return(<li class="cat-product-list">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div class="single-product-item">
                <div class="product-image">
                    <a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="product-image" /></a>
                </div>
            </div>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <div class="list-view-content">
                <div class="single-product-item">
                    <div class="product-info">
                        <div class="customar-comments-box">
                            <a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
                            <div class="rating-box">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star-half-empty"></i>
                            </div>
                            <div class="review-box">
                            {this.props.comments.length>0?<span>{this.props.comments.length} bình luận</span> :<span></span>}
                            </div>
                        </div>
                        <div class="product-datails">
                            <p>{this.props.desc}</p>
                        </div>
                        <div class="price-box">
                            <span class="price">{cost}</span>
                        </div>
                    </div>
                        <div class="overlay-content-list">
                            <ul>
                                <li><a title="Xem sản phẩm" style={{ cursor: 'pointer' }} onClick={this.getDetail}><i className="fa fa-search"></i></a></li>
                                <li><a title="Thêm vào giỏ hàng" style={{ cursor: 'pointer' }} onClick={this.addToCart}><i className="fa fa-shopping-cart"></i></a></li>
                                <li><a title="Quick view" style={{ cursor: 'pointer' }}><i className="fa fa-retweet"></i></a></li>
                                {htmlFavorite}
                            </ul>
                        </div>												
                </div>	
                <RequireAuthentication/>													
            </div>
        </div>
    </li>)
    }
}
var filterColor;
class FilterColor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listColor: [],
            listProduct: []
        }
        filterColor = this;
        this.changeColor = this.changeColor.bind(this);
    }
    changeColor(e){
        main.setState({processing: true});
        chooseColor = e.target.value;
        var ok=false;
        var arrProduct = [];
        for (var i = 0; i < listAllProduct.length; i++) {
            ok = false;
            var sizes = listAllProduct[i].sizes;
            var price = listAllProduct[i].costs[listAllProduct[i].costs.length-1].cost;
            var max = 100000 * choosePrice;
            var min = 100000 * (choosePrice - 1);
            if (choosePrice!=0)
               if (price<min || price >max) continue;
                for (var j = 0; j < sizes.length; j++) {
                    if (ok) break;
                    if (chooseSize != 0 && sizes[j].size != chooseSize) continue;
                    var colors = sizes[j].colors;
                    for (var k = 0; k < colors.length; k++) {
                        if ((chooseColor=="all")||(colors[k].quanty > 0 && colors[k].color == chooseColor)) {
                            ok = true;
                            arrProduct.push(listAllProduct[i]);
                            break;
                        }
                    }
                }
        }
        console.log(arrProduct);
        main.setState({listProduct:arrProduct, processing:false});
    }
    render(){
        var arrColor = [];
        for (var i=0; i<this.state.listProduct.length; i++){
            var product = this.state.listProduct[i];
            for (var j=0; j<product.sizes.length; j++){
                var size = product.sizes[j];
                for (var k=0; k<size.colors.length; k++){
                    var color = size.colors[k];
                    if (color.quanty>0){
                        if (!arrColor.includes(color.color)){
                            arrColor.push(color.color);
                        }
                    }
                }
            }
        }
        return(<div class="radio" onChange={this.changeColor}>
            <label class="filterColor"><input type="radio" name="optionColor" value="all"/>Tất cả</label>
            {arrColor.map(function(color,index){
                return(<label class="filterColor"><input type="radio" name="optionColor" value={color}/>{color}</label>)
            })}
        </div>)
    }
}
class OptionProduct extends React.Component{
    constructor(props){
        super(props);
        this.changePrice = this.changePrice.bind(this);
        this.changeSize = this.changeSize.bind(this);
    }
    changePrice(event){
        main.setState({processing: true});
        choosePrice = parseInt(event.target.value);
        var curProduct = [];
        var max = 100000*choosePrice;
        var min = 100000*(choosePrice-1);
        var ok = false;
        listAllProduct.forEach(product => {
            ok=false;
            var cost = product.costs[product.costs.length-1].cost;
            if ((cost>min && cost<max) || (choosePrice==0)){
                if (chooseSize!=""){
                    for (var i=0; i<product.sizes.length; i++){
                        if (ok) break;
                        if (product.sizes[i].size==chooseSize || chooseSize==0){
                            var colors = product.sizes[i].colors;
                            for (var j=0; j<colors.length; j++){
                                if (chooseColor=="all" || (colors[j].quanty>0&&colors[j].color==chooseColor)){
                                    curProduct.push(product);
                                    ok=true;
                                     break;
                                }
                            }
                        }
                    }
                } else {
                    curProduct.push(product);
                }
            }
        });
        main.setState({listProduct:curProduct, processing:false});
    }
    changeSize(event){
        main.setState({processing: true});
        chooseSize = parseInt(event.target.value);
        var curProduct = [];
        var ok = false;
        listAllProduct.forEach(product => {
            ok=false;
            for (var i=0; i<product.sizes.length; i++){
                if (ok) break;
                if (chooseSize==0 || product.sizes[i].size==chooseSize){
                    if (choosePrice!=""){
                        var max = 100000 * choosePrice;
                        var min = 100000 * (choosePrice - 1);
                        var cost = product.costs[product.costs.length-1].cost;
                        if ((cost>min && cost<max) || (choosePrice==0)){
                            var colors = product.sizes[i].colors;
                            for (var j=0; j<colors.length; j++){
                                if (chooseColor=="all" || (colors[j].quanty>0&&colors[j].color==chooseColor)){
                                    curProduct.push(product);
                                    ok=true;
                                     break;
                                }
                            }
                        }
                    } else {
                        curProduct.push(product);
                    }
                    break;
                }
            }
        });
        main.setState({listProduct:curProduct, processing:false});
    }
    render(){
        return(<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">      
        <div class="product-left-sidebar">
            <h2 class="left-title pro-g-page-title">LỌC SẢN PHẨM</h2>
            <div class="product-single-sidebar">
                <span class="sidebar-title">Điều kiện</span>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">LỌC THEO GIÁ</span>        
                    <div class="radio" onChange={this.changePrice}>
                        <label><input type="radio" name="optionPrice" value="0"/>Tất cả</label> <br/>
                        <label><input type="radio" name="optionPrice" value="1"/> &lt; 100.000 VND</label>
                        <label><input type="radio" name="optionPrice" value="2"/>100.000 - 200.000 VND</label>
                        <label><input type="radio" name="optionPrice" value="3"/>200.000 - 300.000 VND</label>
                        <label><input type="radio" name="optionPrice" value="4"/>300.000 - 400.000 VND</label>
                        <label><input type="radio" name="optionPrice" value="5"/>400.000 - 500.000 VND</label>
                        <label><input type="radio" name="optionPrice" value="6"/>&gt; 500.000 VND</label>
                    </div>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">LỌC THEO SIZE</span>
                    <div class="radio" onChange={this.changeSize}>
                        <label><input type="radio" name="optionSize" value="0"/>Tất cả</label> <br/>
                        <label><input type="radio" name="optionSize" value="35" />Size 35</label> <br/>
                        <label><input type="radio" name="optionSize" value="36" />Size 36</label> <br/>
                        <label><input type="radio" name="optionSize" value="37" />Size 37</label> <br/>
                        <label><input type="radio" name="optionSize" value="38" />Size 38</label> <br/>
                        <label><input type="radio" name="optionSize" value="39" />Size 39</label> <br/>
                        <label><input type="radio" name="optionSize" value="40" />Size 40</label> <br/>
                        <label><input type="radio" name="optionSize" value="41" />Size 41</label> <br/>
                        <label><input type="radio" name="optionSize" value="42" />Size 42</label> <br/>
                        <label><input type="radio" name="optionSize" value="43" />Size 43</label> <br/>
                        <label><input type="radio" name="optionSize" value="44" />Size 44</label> <br/>
                    </div>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">LỌC THEO MÀU SẮC</span>
                    <FilterColor/>
            </div>
        </div>
    </div>)
    }
}
class OptionView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            displayview: 1
        }
        this.changeToGird = this.changeToGird.bind(this);
        this.changeToList = this.changeToList.bind(this);
        this.changeSort = this.changeSort.bind(this);
    }
    changeToGird(){
        if (main.state.display==2){
            this.setState({displayview:1})
            main.setState({display:1});
        }
    }
    changeToList(){
        if (main.state.display==1){
            this.setState({displayview:2})
            main.setState({display:2});
        }
    }
    changeSort(event){
        main.setState({processing: true});
        const optionSort = parseInt(this.refs.sort.value);
        console.log(optionSort);
        var dataSort = main.state.listProduct;
        var tmp;
        switch(optionSort){
            case 1:
                for (var i=0; i<dataSort.length-1; i++){
                    for (var j=i+1; j<dataSort.length; j++){
                        if (dataSort[i].costs[dataSort[i].costs.length-1].cost>dataSort[j].costs[dataSort[j].costs.length-1].cost){
                            tmp = dataSort[i];
                            dataSort[i]=dataSort[j];
                            dataSort[j]=tmp;
                        }
                    }
                }
                break;
            case 2:
                for (var i=0; i<dataSort.length-1; i++){
                    for (var j=i+1; j<dataSort.length; j++){
                        if (dataSort[i].costs[dataSort[i].costs.length-1].cost<dataSort[j].costs[dataSort[j].costs.length-1].cost){
                            tmp = dataSort[i];
                            dataSort[i]=dataSort[j];
                            dataSort[j]=tmp;
                        }
                    }
                }
                break;
            case 3:
                for (var i=0; i<dataSort.length-1; i++){
                    for (var j=i+1; j<dataSort.length; j++){
                        if (dataSort[i].name>dataSort[j].name){
                            tmp = dataSort[i];
                            dataSort[i]=dataSort[j];
                            dataSort[j]=tmp;
                        }
                    }
                }
                break;
            case 4:
                for (var i=0; i<dataSort.length-1; i++){
                    for (var j=i+1; j<dataSort.length; j++){
                        if (dataSort[i].name<dataSort[j].name){
                            tmp = dataSort[i];
                            dataSort[i]=dataSort[j];
                            dataSort[j]=tmp;
                        }
                    }
                }
                break;
        }
        if (optionSort==0){
            main.setState({listProduct:listAllProduct,processing:false});
        } else {
            main.setState({listProduct:dataSort,processing:false});
        }
    }
    render(){
        var optionView="";
        if (this.state.displayview==1){
            optionView = <ul>
                <li class="active"><a style={{ cursor: 'pointer' }} onClick={this.changeToGird}><i class="fa fa-th-large"></i></a><br />Grid</li>
                <li><a style={{ cursor: 'pointer' }} onClick={this.changeToList}><i class="fa fa-th-list"></i></a><br />List</li>
            </ul>
        } else {
            optionView = <ul>
                <li><a style={{cursor:'pointer'}} onClick={this.changeToGird}><i class="fa fa-th-large"></i></a><br />Grid</li>
                <li class="active"><a style={{cursor:'pointer'}} onClick={this.changeToList}><i class="fa fa-th-list"></i></a><br />List</li>
            </ul>
        }
        return(<div class="product-shooting-bar">
        <div class="shoort-by">
            <label for="productShort">Sắp xếp</label>
            <div class="short-select-option">
                <select name="sortby" ref="sort" onChange={this.changeSort}>
                    <option value="0">--</option>
                    <option value="1">Giá: thấp - cao</option>
                    <option value="2">Giá: cao - thấp</option>
                    <option value="3">Tên sản phẩm: A - Z</option>
                    <option value="4">Tên sản phẩm: Z - A</option>
                </select>												
            </div>
        </div>
        <div class="view-systeam">
            <label for="perPage">View:</label>
            {optionView}
        </div>
    </div>)
    }
}
class Category extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listProduct: [],
            category:{},
            display: 1,
            processing:false,
            curpage:1
        }
        choosePrice = "";
        chooseSize = "";
        main = this;
        this.changePage = this.changePage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }
    componentDidMount(){
        var name = localStorage.getItem("curcategory");
        var that = this;
        $.get("/getCategoryProduct/"+name,function(data){
            if (data!=""){
                listAllProduct = data.lProduct;
                that.setState({listProduct:data.lProduct,category:data.category});
                filterColor.setState({listProduct:data.lProduct});
            }
        })
    }
    changePage(value, event) {
        this.setState({ curpage: value });
    }
    previousPage(){
        if (this.state.curpage>1)
              this.setState({curpage:this.state.curpage-1});
    }
    nextPage(){
        var length = this.state.listProduct.length;
        var perpage = 8;
        if (this.state.curpage<Math.ceil(length / perpage))
              this.setState({curpage:this.state.curpage+1});
    }
    render(){
        initizeAnalytics();
        var page = "";
        var lCurProduct = [];
        var length = this.state.listProduct.length;
        if (length!=0){
            page = [];
            var perpage = 8;
            var start = (this.state.curpage - 1) * perpage;
            var finish = (start+perpage);
            if (finish>length) finish=length;
            lCurProduct = this.state.listProduct.slice(start, start + perpage);
            var numberpage = Math.ceil(length / perpage);
            for (var i = 1; i <= numberpage; i++) {
                if (this.state.curpage == i) {
                    page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
                } else {
                    page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
                }
            }
        }
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>{this.state.category.displayName}</span>
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
                                    {/* <h2>{this.state.category.name}</h2> */}
                                </div>									
                            </div>
                        </div>
                        <div class="product-category-title">
                            <h1>
                                <span class="cat-name">{this.state.category.displayName}</span>
                                <span class="count-product">Có {this.state.listProduct.length} sản phẩm</span>
                            </h1>
                        </div>
                        <div class="product-shooting-area">
                            <OptionView/>
                            {/* <div class="product-shooting-result">
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
                            </div> */}
                        </div>
                    </div>                  
                    <div class="all-gategory-product">
                        <div class="row">
                        {this.state.processing==true ? <div class="loader text-center"></div> : ""}
                            <ul class="gategory-product">											
                                {lCurProduct.map(function(pro,index){
                                    if (main.state.display==1){
                                        var comment = [];
                                        if (pro.comments) 
                                           if (pro.comments.length>0) comment = pro.comments;
                                        return <ProductGird key={index} name={pro.name} costs={pro.costs}
                                            image={pro.image.image1} id={pro._id} size={pro.sizes} comments={comment}/>
                                    } else {
                                        var comment = [];
                                        if (pro.comments) 
                                           if (pro.comments.length>0) comment = pro.comments;
                                        return <ProductList key={index} name={pro.name} costs={pro.costs}
                                            image={pro.image.image1} id={pro._id} desc={pro.description} size={pro.sizes}
                                            comments={comment}/>
                                    }
                                })}
                            </ul>
                        </div>
                    </div>    
                        <div class='panel-footer'>
                            <ul class='pagination pagination-sm'>
                                <li>
                                    <a style={{ cursor: 'pointer' }} onClick={this.previousPage}>«</a>
                                </li>
                                {page}
                                <li>
                                    <a style={{ cursor: 'pointer' }} onClick={this.nextPage}>»</a>
                                </li>
                            </ul>
                            <div class='pull-right'>
                                Hiển thị từ {start + 1} đến {finish} trên {this.state.listProduct.length} sản phẩm
                                </div>
                        </div> 
                    {/* <div class="product-shooting-result product-shooting-result-border">
                            <div class="showing-item">
                                
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
                    </div>	 */}
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