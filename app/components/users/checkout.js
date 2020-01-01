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
var main,step1,step2,map;

class SingleProduct extends React.Component {
    constructor(props){
        super(props);
        this.changeQuanty = this.changeQuanty.bind(this);
        this.state = {
            quanty: this.props.quanty,
            cursize: 0,
            size: this.props.size,
            curcolor: this.props.color
        }
        this.changeColor = this.changeColor.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    changeQuanty(e){   
        this.setState({quanty: e.target.value});
        var arrCost = step1.state.sumcost;
        var arrProduct = step1.state.listProduct;
        arrCost[this.props.stt-1] = parseInt(e.target.value)*this.props.costs[this.props.costs.length-1].cost;
        arrProduct[this.props.stt-1].quanty = parseInt(e.target.value);
        step1.setState({sumcost:arrCost,listProduct:arrProduct});
    }
    changeSize(e){
        var arrProduct = step1.state.listProduct;
        var sizenow = parseInt(e.target.value);
        arrProduct[this.props.stt-1].size = sizenow;
        step1.setState({listProduct:arrProduct});
        this.setState({size:sizenow,cursize:sizenow});
    }
    changeColor(e){
        var arrProduct = step1.state.listProduct;
        arrProduct[this.props.stt-1].color = e.target.value;
        step1.setState({listProduct:arrProduct});
        this.setState({curcolor:e.target.value});
    }
    deleteProduct(){
        $.post("/removeFromCart",{email:localStorage.getItem('email'),id:this.props.id},function(data){
			var {dispatch} = main.props;
            dispatch({type:"UPDATE_PRODUCT",newcart:data});
            var arrayCostProduct=[];
            data.forEach(pro => {
                arrayCostProduct.push(pro.product.costs[pro.product.costs.length-1].cost*pro.quanty);
            });
            step1.setState({listProduct:data,sumcost:arrayCostProduct})
		})
    }
    render(){
        var htmlSize=[],htmlColor=[];
        htmlSize.push(<option value='0'>Chọn Size</option>)
        this.props.sizes.forEach(e => {
            var size = <option value={e.size}>{e.size}</option>
            htmlSize.push(size);
            if (e.size == this.state.cursize) {
                for (var i=0; i<e.colors.length; i++){
                    var color = <div><label><input type="radio" name={"optionColor"+this.props.stt} value={e.colors[i].color}/>{e.colors[i].color}</label><br/></div>
                    htmlColor.push(color);
                }
            }
        });        
        return(<tr>
            <td>{this.props.stt}</td>
            <td class="cart-product">
                <a href="#"><img alt="Blouse" src={this.props.image}/></a>
            </td>
            <td class="cart-description">
                <p class="product-name"><a href="#">{this.props.name}</a></p>
                <div>
                    <h4>Chọn Size:</h4>
                    <select name="product-size" style={{width:'50%'}} ref="size" onChange={this.changeSize}>
                        {htmlSize}
                    </select>
                    <h4>Chọn Màu:</h4>
                    <div class="radio" ref='color' onChange={this.changeColor}>
                        {htmlColor}
                    </div>
                </div>
                <small><a href="#">Size : {this.state.size}, Color : {this.state.curcolor}</a></small>
            </td>
            <td class="cart-unit">
                <ul class="price text-right">
                    <li class="price">{this.props.costs[this.props.costs.length-1].cost}đ</li>
                </ul>
            </td>
            <td class="cart_quantity text-center">
                <div class="cart-plus-minus-button">
                    <input class="cart-plus-minus" type="number" name="qtybutton" min="1" max={this.props.qty}
                    value={this.state.quanty} ref="quanty" onChange={(e)=>this.changeQuanty(e)} required/>
                </div>
            </td>
            <td class="cart-delete text-center">
                <span>
                    <a stye={{cursor:'pointer'}} onClick={this.deleteProduct} class="cart_quantity_delete" title="Delete">
                        <i class="fa fa-trash-o"></i></a>
                </span>
            </td>
            <td class="cart-total">
                <span class="price">{this.props.costs[this.props.costs.length-1].cost*parseInt(this.state.quanty)}</span>
            </td>
        </tr>)
    }
}
class Summary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listProduct: [],
            sumcost:[]
        }
        this.goStep2 = this.goStep2.bind(this);
        step1 = this;
    }
    componentDidMount(){
        var that = this;
        $.post("/cart",{email:localStorage.getItem('email')},function(data){
            var arrayCostProduct=[];
            data.forEach(pro => {
                arrayCostProduct.push(pro.product.costs[pro.product.costs.length-1].cost*pro.quanty);
            });
            console.log(arrayCostProduct);
            that.setState({listProduct:data,sumcost:arrayCostProduct})
        })
    }
    goStep2(){
        var arrProduct = [];
        this.state.listProduct.forEach(pro => {
            var product = {
                id: pro.product._id,
                name: pro.product.name,
                image:pro.product.image.image1,
                quanty: pro.quanty,
                color: pro.color,
                size: pro.size,
                cost: pro.product.costs[pro.product.costs.length-1].cost
            }
            arrProduct.push(product);
        });
        var sumCost = 0;
        this.state.sumcost.forEach(e => {
            sumCost+=e;
        });
        var order = {
            email: localStorage.getItem('email'),
            time: new Date().toLocaleString(),
            timestamp: parseInt(Date.now().toString()),
            fullname:"",
            phonenumber:"",
            address: "",
            sumproductcost: sumCost,
            sumshipcost: 0,
            listproduct: arrProduct,
            status: "unconfimred",
            code: -1
        }
        $.post("/saveOrder",{order:JSON.stringify(order)},function(data){
            localStorage.setItem("curorder",data);
            main.setState({curStep:2});
        })
    }
    render(){
        var sumCost = 0;
        this.state.sumcost.forEach(e => {
            sumCost+=e;
        });
        var maxShip=0;
        this.state.listProduct.forEach(e => {
            if (e.product.shipcost > maxShip) {
                maxShip = e.product.shipcost;
            }
        });
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right	"></i></span>
                        <span>Giỏ hàng của bạn</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2 class="page-title">Tổng kết giỏ hàng <span class="shop-pro-item">Giỏ hàng của bạn gồm {this.state.listProduct.length} sản phẩm</span></h2>
                </div>	
                
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-current first">
                                <span>01. Giỏ hàng</span>
                            </li>
                            <li class="step-todo second">
                                <span>02. Địa chỉ</span>
                            </li>
                            <li class="step-todo third">
                                <span>03. Xác nhận</span>
                            </li>
                            <li class="step-todo last" id="step_end">
                                <span>04. Hoàn tất</span>
                            </li>
                        </ul>									
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered" id="cart-summary">
                            <thead>
                                <tr>
                                    <th class="cart-product">#</th>
                                    <th class="cart-product">Sản phẩm</th>
                                    <th class="cart-description">Mô tả</th>
                                    <th class="cart-unit text-right">Giá</th>
                                    <th class="cart_quantity text-center">Số lượng</th>
                                    <th class="cart-delete">&nbsp;</th>
                                    <th class="cart-total text-right">Tổng</th>
                                </tr>
                            </thead>
                            <tbody>	
                                {this.state.listProduct.map(function(pro,index){
                                    return <SingleProduct key={index} image={pro.product.image.image1} id={pro.product._id}
                                    name ={pro.product.name} size={pro.size} color={pro.color} sizes={pro.product.sizes}
                                    quanty={pro.quanty} costs ={pro.product.costs} stt={index+1} qty={pro.product.quanty}/>
                                })}
                            </tbody>
                            <tfoot>										
                                <tr class="cart-total-price">
                                    <td class="cart_voucher" colspan="3" rowspan="4"></td>
                                    <td class="text-right" colspan="3">Tổng tiền sản phẩm</td>
                                    <td id="total_product" class="price" colspan="1">{sumCost}đ</td>
                                </tr>
                                <tr>
                                    <td class="text-right" colspan="3">Tổng tiền vận chuyển</td>
                                    <td id="total_shipping" class="price" colspan="1">Chưa xác định</td>
                                </tr>
                                <tr>
                                    <td class="total-price-container text-right" colspan="3">
                                        <span>Tổng</span>
                                    </td>
                                    <td id="total-price-container" class="price" colspan="1">
                                        <span id="total-price">{sumCost}đ (tạm tính)</span>
                                    </td>
                                </tr>
                            </tfoot>									
                        </table>   
                    </div>
                </div>              
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="returne-continue-shop">
                        <a href="/" class="continueshoping"><i class="fa fa-chevron-left" type='submit'></i>Tiếp tục mua hàng</a>
                        <a class="procedtocheckout" onClick={this.goStep2} style={{cursor:'pointer'}}>Tiếp tục thanh toán<i class="fa fa-chevron-right"></i></a>
                    </div>						
                </div>
            </div>
        </div>
    </section>)
    }   
}

class GoogleMap extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            position:{}
        }
        map = this;
    }
    render(){
        var url = "https://maps.google.com/maps?q="+this.state.position.lat+","+this.state.position.lng+"&t=&z=13&ie=UTF8&iwloc=&output=embed";
        return(<div class="mapouter" >
        <div class="gmap_canvas">
            <iframe width="350" height="250" id="gmap_canvas"
                src={url} frameborder="0"
                scrolling="no" marginheight="0" marginwidth="0">
            </iframe>
            <a href="https://www.couponflat.com"></a>
        </div>
    </div>)
    }
}
class Address extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            err:""
        }
        this.addAddress = this.addAddress.bind(this);
        this.checkPosition = this.checkPosition.bind(this);
    }
    addAddress(e){
        e.preventDefault();
        var address = this.refs.address.value;
        var fullname = this.refs.fullname.value;
        var phonenumber = this.refs.phonenumber.value;
        var that = this;
        $.post("/updateAddress",{id:localStorage.getItem('curorder'),address:address, fullname:fullname,phonenumber:phonenumber},function(data){
            if (data.err == 0) {
                $.post("/sendmail", { order: JSON.stringify(data.data), id: localStorage.getItem('curorder'), ship:data.ship}, function (data) {
                    main.setState({ curStep: 3 });
                })
            } else {
                that.setState({err:"Vui lòng kiểm tra lại địa chỉ"})
            }
        })
    }
    checkPosition(){
        var address = this.refs.address.value;
        var that = this;
        $.post("/getPosition",{address:address},function(data){
            if (data.err!=""){
                that.setState({err:data.err})
            } else {
                map.setState({position:data.position});
            }
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
                        <span>Địa chỉ</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-todo first step-done">
                                <span>01. Giỏ hàng</span>
                            </li>                   
                            <li class="step-current second">
                                <span>02. Địa chỉ</span>
                            </li>
                            <li class="step-todo third">
                                <span>03. Xác nhận</span>
                            </li>
                            <li class="step-todo last" id="step_end">
                                <span>04. Hoàn tất</span>
                            </li>
                        </ul>								
                    </div>
                </div> 
            </div>
            <div class="row address">
                <form method="POST" onSubmit={this.addAddress}>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Tên" name="name" required ref="fullname"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Số điện thoại" name="numberphone" required ref="phonenumber"/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Địa chỉ nhận hàng" name="location" required ref="address"/>
                        </div>
                        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">               
                            <button type="button" className="btn btn-warning" onClick={this.checkPosition}>Kiểm tra địa chỉ</button>
                        </div>
                    </div>
                    <div class="row text-center">
                        {/* <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3"> */}
                            <GoogleMap/>
                        {/* </div> */}
                    </div>		                        
                    <h3 style={{color:'red'}} className='text-center'>{this.state.err}</h3>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <button type="submit" class="btn btn-danger">Tiếp tục thanh toán</button>
                        </div>
                    </div>
                </form>			
            </div>
        </div>
    </section>)
    }
}

class Confirm extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>Địa chỉ</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-todo first step-done">
                                <span><a href="/checkout">01. Tổng kết</a></span>
                            </li>                   
                           
                            <li class="step-todo second step-done">
                                <span>02. Địa chỉ</span>
                            </li>
                            <li class="step-current third">
                                <span>03. Xác nhận</span>
                            </li>
                            <li class="step-todo last" id="step_end">
                                <span>04. Hoàn tất</span>
                            </li>
                        </ul>								
                    </div>
                </div> 
            </div>
            <div class="row address">
                <h3 class="text-center">Một email đã được gửi vào vào tài khoản email của bạn!</h3>
                <h3 class="text-center">Vui lòng vào email để xác nhận đơn hàng!</h3>		
            </div>
        </div>
    </section>)
    }
}
class TotalPage extends React.Component{
    constructor(props){
        super(props);
        main = this;
        this.state = {
            curStep: 1,
            permission: false
        }
        this.goLogin = this.goLogin.bind(this);
    }
    componentDidMount(){
        var that = this;
        const token = localStorage.getItem('token');
        $.get("/api", { token: token }, function (data) {
            if (data.success == 1) {
                that.setState({ permission: 1 });
            }
        })
    }
    goLogin(){
        window.location.replace("/login");
    }
    render(){
        $.post("/addNewDay",function(data){
            
        })
        if (this.state.permission==0){
            return (<div className="text-center">
                <br/>
                <h3>Để thực hiện chức năng này bạn phải đăng nhập!</h3>
                <button className="btn btn-primary" onClick={this.goLogin} style={{marginTop:'10px',width:'auto'}}>Đi đến trang đăng nhập</button>
            </div>)
        } else {
            var currentStepComponent;
            if (this.state.curStep == 1) {
                currentStepComponent = <Summary />
            } else if (this.state.curStep == 2) {
                currentStepComponent = <Address />
            } else if (this.state.curStep == 3) {
                currentStepComponent = <Confirm />
            }
            return (
                <div>
                    {currentStepComponent}
                </div>
            )
        }
        
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
    </Provider>, document.getElementById("checkout")
)