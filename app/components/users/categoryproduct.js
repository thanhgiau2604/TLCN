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
var main,choosePrice,chooseSize,listAllProduct;
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
                        <span>1 Review(s)</span>
                    </div>
                </div>
                <a onClick={this.getDetail} style={{cursor:'pointer'}}>{this.props.name}</a>
                <div class="price-box">
                    <span class="price">{this.props.costs[this.props.costs.length-1].cost}</span>
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
			htmlFavorite=<li><a title="Xóa khỏi favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o" style={{color:'#ff5858'}}></i></span></a></li>
		} else {
			htmlFavorite=<li><a title="Thêm vào favorite list" style={{cursor:'pointer'}} onClick={this.handleFavorite}><span className="fa-stack"><i className="fa fa-heart-o"></i></span></a></li>
		}
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
                                <span>1 Review(s)</span>
                            </div>
                        </div>
                        <div class="product-datails">
                            <p>{this.props.desc}</p>
                        </div>
                        <div class="price-box">
                            <span class="price">{this.props.costs[this.props.costs.length-1].cost}</span>
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

class OptionProduct extends React.Component{
    constructor(props){
        super(props);
        this.changePrice = this.changePrice.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.checkPrice = this.checkPrice.bind(this);
    }
    checkPrice(price){

    }
    changePrice(event){
        choosePrice = parseInt(event.target.value);
        var curProduct = [];
        var max = 100000*choosePrice;
        var min = 100000*(choosePrice-1);
        listAllProduct.forEach(product => {
            var cost = product.costs[product.costs.length-1].cost;
            if (cost>min && cost<max){
                if (chooseSize!=""){
                    for (var i=0; i<product.sizes.length; i++){
                        if (product.sizes[i].size==chooseSize){
                            curProduct.push(product);
                            break;
                        }
                    }
                } else {
                    curProduct.push(product);
                }
            }
        });
        main.setState({listProduct:curProduct});
    }
    changeSize(event){
        chooseSize = parseInt(event.target.value);
        var curProduct = [];
        listAllProduct.forEach(product => {
            for (var i=0; i<product.sizes.length; i++){
                if (product.sizes[i].size==chooseSize){
                    if (choosePrice!=""){
                        var max = 100000 * choosePrice;
                        var min = 100000 * (choosePrice - 1);
                        var cost = product.costs[product.costs.length-1].cost;
                        if (cost>min && cost<max){
                            curProduct.push(product);
                        }
                    } else {
                        curProduct.push(product);
                    }
                    break;
                }
            }
        });
        main.setState({listProduct:curProduct});
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
                        <label><input type="radio" name="optionPrice" value="1"/> &lt; 100 000 VND</label>
                        <label><input type="radio" name="optionPrice" value="2"/>100 000 - 200 000 VND</label>
                        <label><input type="radio" name="optionPrice" value="3"/>200 000 - 300 000 VND</label>
                        <label><input type="radio" name="optionPrice" value="4"/>300 000 - 400 000 VND</label>
                        <label><input type="radio" name="optionPrice" value="5"/>400 000 - 500 000 VND</label>
                        <label><input type="radio" name="optionPrice" value="6"/>&gt; 500 000 VND</label>
                    </div>
            </div>
            <div class="product-single-sidebar">
                <span class="sidebar-title">LỌC THEO SIZE</span>
                    <div class="radio" onChange={this.changeSize}>
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
            main.setState({listProduct:listAllProduct});
        } else {
            main.setState({listProduct:dataSort});
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
            display: 1
        }
        choosePrice = "";
        chooseSize = "";
        main = this;
    }
    componentDidMount(){
        var name = localStorage.getItem("curcategory");
        var that = this;
        $.get("/getCategoryProduct/"+name,function(data){
            listAllProduct = data.lProduct;
            that.setState({listProduct:data.lProduct,category:data.category})
        })
    }
    render(){
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
                            <ul class="gategory-product">											
                                {this.state.listProduct.map(function(pro,index){
                                    if (main.state.display==1){
                                        return <ProductGird key={index} name={pro.name} costs={pro.costs}
                                            image={pro.image.image1} id={pro._id}/>
                                    } else {
                                        return <ProductList key={index} name={pro.name} costs={pro.costs}
                                            image={pro.image.image1} id={pro._id} desc={pro.description}/>
                                    }
                                })}
                            </ul>
                        </div>
                    </div>     
                    <div class="product-shooting-result product-shooting-result-border">
                        <div class="showing-item">
                        </div>
                        {/* <div class="showing-next-prev">
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
                        </div> */}
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