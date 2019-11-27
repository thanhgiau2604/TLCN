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
var main,step1,step2;

class SingleProduct extends React.Component {
    constructor(props){
        super(props);
        this.changeQuanty = this.changeQuanty.bind(this);
        this.state = {
            quanty: this.props.quanty
        }
    }
    changeQuanty(e){
        this.setState({quanty: e.target.value});
        var arrCost = step1.state.sumcost;
        arrCost[this.props.stt-1] = parseInt(e.target.value)*this.props.cost;
        console.log(this.props.stt-1);
        console.log(arrCost);
        step1.setState({sumcost:arrCost});
    }
    render(){
        return((<tr>
            <td>{this.props.stt}</td>
            <td class="cart-product">
                <a href="#"><img alt="Blouse" src={this.props.image}/></a>
            </td>
            <td class="cart-description">
                <p class="product-name"><a href="#">{this.props.name}</a></p>
                <small><a href="#">Size : {this.props.size}, Color : {this.props.color}</a></small>
            </td>
            <td class="cart-unit">
                <ul class="price text-right">
                    <li class="price">{this.props.cost}đ</li>
                </ul>
            </td>
            <td class="cart_quantity text-center">
                <div class="cart-plus-minus-button">
                    <input class="cart-plus-minus" type="text" name="qtybutton" value={this.state.quanty} ref="quanty" onChange={(e)=>this.changeQuanty(e)}/>
                </div>
            </td>
            <td class="cart-delete text-center">
                <span>
                    <a href="#" class="cart_quantity_delete" title="Delete"><i class="fa fa-trash-o"></i></a>
                </span>
            </td>
            <td class="cart-total">
                <span class="price">{this.props.cost*parseInt(this.state.quanty)}</span>
            </td>
        </tr>))
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
                arrayCostProduct.push(pro.product.cost*pro.quanty);
            });
            console.log(arrayCostProduct);
            that.setState({listProduct:data,sumcost:arrayCostProduct})
        })
    }
    goStep2(){
        var arrProduct = [];
        this.state.listProduct.forEach(pro => {
            var product = {
                name: pro.product.name,
                quanty: pro.quanty,
                color: pro.color,
                size: pro.size,
                cost: pro.product.cost
            }
            arrProduct.push(product);
        });
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
        var order = {
            email: localStorage.getItem('email'),
            address: {},
            sumproductcost: sumCost,
            sumshipcost: maxShip,
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
                        <a href="index-2.html">Trang chủ</a>
                        <span><i class="fa fa-caret-right	"></i></span>
                        <span>Giỏ hàng của bạn</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2 class="page-title">Tổng kết giỏ hàng <span class="shop-pro-item">Giỏ hàng của bạn gồm 3 sản phẩm</span></h2>
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
                                    return <SingleProduct key={index} image={pro.product.image.image1} 
                                    name ={pro.product.name} size={pro.size} color={pro.color}
                                    quanty={pro.quanty} cost ={pro.product.cost} id={pro.product._id} stt={index+1}/>
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
                                    <td id="total_shipping" class="price" colspan="1">{maxShip}đ</td>
                                </tr>
                                <tr>
                                    <td class="total-price-container text-right" colspan="3">
                                        <span>Tổng</span>
                                    </td>
                                    <td id="total-price-container" class="price" colspan="1">
                                        <span id="total-price">{sumCost+maxShip}đ</span>
                                    </td>
                                </tr>
                            </tfoot>									
                        </table>   
                    </div>
                </div>              
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="returne-continue-shop">
                        <a href="/" class="continueshoping"><i class="fa fa-chevron-left"></i>Tiếp tục mua hàng</a>
                        <a class="procedtocheckout" onClick={this.goStep2} style={{cursor:'pointer'}}>Tiếp tục thanh toán<i class="fa fa-chevron-right"></i></a>
                    </div>						
                </div>
            </div>
        </div>
    </section>)
    }   
}

class Address extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
        this.addAddress = this.addAddress.bind(this);
    }
    addAddress(e){
        e.preventDefault();
        var address = {
            fullname: this.refs.fullname.value,
            phonenumber: this.refs.phonenumber.value,
            province: this.refs.province.value,
            district: this.refs.district.value,
            commune: this.refs.commune.value,
            apartmentnumber: this.refs.apartmentnumber.value
        }
        $.post("/updateAddress",{id:localStorage.getItem('curorder'),address:JSON.stringify(address)},function(data){
            $.post("/sendmail",{order:JSON.stringify(data),id:localStorage.getItem('curorder')},function(data){
                main.setState({curStep:3});
            })
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
                            <li class="step-current second">
                                <span>02. Địa chỉ</span>
                            </li>
                            <li class="step-todo third step-done">
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
                            <input type="text" placeholder="Tỉnh/Thành phố" name="province" required ref="province"/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Quận/Huyện" name="district" required ref="district"/>
                        </div>	
                    </div>

                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Phường/Xã" name="phuong" required ref="commune"/>
                        </div>	
                    </div>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-md-push-3">
                            <input type="text" placeholder="Tòa nhà, Tên đường" name="location" required ref="apartmentnumber"/>
                        </div>
                    </div>	
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
                        <a href="index.html">Trang chủ</a>
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
            curStep: 1
        }
    }
    render(){
        var currentStepComponent;
        if (this.state.curStep==1){
            currentStepComponent = <Summary/>
        } else if (this.state.curStep==2){
            currentStepComponent = <Address/>
        } else if (this.state.curStep==3){
            currentStepComponent = <Confirm/>
        }
        return(
            <div>
                {currentStepComponent}
            </div>
        )
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