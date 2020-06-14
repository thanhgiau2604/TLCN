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
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
var main,step1,step2,map;
import ReactGA from 'react-ga'
function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
var sumCostProduct;
var modalDiscount,listDiscount=[];
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
                    if (e.colors[i].quanty>0){
                        var color = (
                          <div>
                              <label>
                              <input type="radio" name={"optionColor" + this.props.stt} value={e.colors[i].color} />
                              {e.colors[i].color}
                             </label>
                            <br />
                          </div>
                        );
                        htmlColor.push(color);
                    }
                }
            }
        });  
        var strCost = this.props.costs[this.props.costs.length-1].cost.toString();
		var cost ="", count=0;
		for (var i=strCost.length-1; i>=0; i--){
			count++;
			cost=strCost[i]+cost;
			if (count%3==0) cost=" "+cost;
        }     
        var strTotal = (this.props.costs[this.props.costs.length-1].cost*parseInt(this.state.quanty)).toString();
        var tcost ="" , count1=0;
        for (var i=strTotal.length-1; i>=0; i--){
			count1++;
			tcost=strTotal[i]+tcost;
			if (count1%3==0) tcost=" "+tcost;
        }   
        return(<tr>
            <td>{this.props.stt}</td>
            <td class="cart-product">
                <a href="#"><img alt="Blouse" src={this.props.image}/></a>
            </td>
            <td class="cart-description">
                <p class="product-name"><a href="#">{this.props.name}</a></p>
                <div>
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
                    <li class="price">{cost}đ</li>
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
            <td class="cart-total text-center">
                <span class="price"><b>{tcost}đ</b></span>
            </td>
        </tr>)
    }
}
class Voucher extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            apply: -1
        }
    }
    componentDidMount(){
        if (sumCostProduct<this.props.voucher.valueCondition){
            this.setState({apply:-1});
        } else {
            this.setState({apply:0});
        }
    }
    applyVoucher(){
        this.setState({apply:1});
        step1.setState({costVoucher: this.props.voucher.value});
        console.log(listDiscount);
        var arrVoucher = listDiscount;
        arrVoucher[this.props.voucher.stt-1].choose = true;
    }
    cancelVoucher(){
        this.setState({apply:0});
        step1.setState({costVoucher: 0});
        var arrVoucher = listDiscount;
        arrVoucher[this.props.voucher.stt-1].choose = false;
    }
    render(){
        console.log(listDiscount[this.props.voucher.stt-1].choose);
        return(<tr>
            <td class="text-center">{this.props.voucher.stt}</td>
            <td class="text-center">{this.props.voucher.name}</td>
            <td class="text-center">{this.props.voucher.condition}</td>
            <td class="text-center"> 
                {this.state.apply==1||listDiscount[this.props.voucher.stt-1].choose==true ? <button class="btn btn-danger" onClick={this.cancelVoucher.bind(this)}>Hủy</button> :
                (this.state.apply==0? <button class="btn btn-success" onClick={this.applyVoucher.bind(this)}>Áp dụng</button> :
                <button class="btn btn-success" disabled="true">Áp dụng</button>)}
            </td>
        </tr>)
    }
}
class ModalDiscount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listVoucher: []
        }
        modalDiscount = this;
    }
    render(){
        return(<div class="container">
        <div class="modal fade" id="modalDiscount" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Chọn ShoeLG Voucher</h4>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="form-group">
                      <label for="quanty">Danh sách Voucher:</label>
                      <label for="quanty">Chỉ được chọn 1 Voucher:</label>
                      <table class='table'>
                        <thead>
                          <tr>
                            <th class="text-center">#</th>
                            <th class="text-center">Voucher</th>
                            <th class="text-center">Điều kiện</th>
                            <th class="text-center">Chọn</th>
                          </tr>
                        </thead>
                        <tbody>
                            {this.state.listVoucher.map(function(voucher,index){
                                return(<Voucher key={index} voucher={voucher}/>)
                            })}
                        </tbody>
                      </table>
                    </div>  
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Đồng ý</button>
              </div>
            </div>
          </div>
        </div>
      </div>)
    }
}
class Summary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listProduct: [],
            sumcost:[],
            costVoucher: 0
        }
        this.goStep2 = this.goStep2.bind(this);
        this.discount = this.discount.bind(this);
        step1 = this;
    }
    componentDidMount(){
        var that = this;
        $.post("/cart",{email:localStorage.getItem('email')},function(data){
            var arrayCostProduct=[];
            data.forEach(pro => {
                arrayCostProduct.push(pro.product.costs[pro.product.costs.length-1].cost*pro.quanty);
            });
            that.setState({listProduct:data,sumcost:arrayCostProduct})
        })
        console.log(listDiscount);
        if (listDiscount.length>0){
            var index = listDiscount.findIndex(item => item.choose==true);
            console.log("index="+index);
             if (index!=-1){
                this.setState({costVoucher: listDiscount[index].value});
            }
        }
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
                cost: pro.product.costs[pro.product.costs.length-1].cost,
                status:"unconfirmed"
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
            status: "unconfirmed",
            code: -1,
            payment: false,
            costVoucher: this.state.costVoucher
        }
        if (localStorage.getItem("curorder")){
            $.post("/updateOrder",{id:localStorage.getItem("curorder"),order:JSON.stringify(order)}, function(data){
                main.setState({curStep:2});
            })
        } else {
            $.post("/saveOrder",{order:JSON.stringify(order)},function(data){
                localStorage.setItem("curorder",data);
                main.setState({curStep:2});
            })
        }
    }
    discount(){
        var email = localStorage.getItem("email");
        var phone = localStorage.getItem("phone");
        $.post("/getVoucher",{email:email,phone:phone},function(data){
            var listVoucher = [];
            if (data.voucher.length>0){
                for (var i=1; i<=data.voucher.length; i++){
                    var value = (i*50000);
                    var strValue = value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                    var valueCondition = (200000+i*i*50000);
                    var condition = valueCondition.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                    var singleVoucher = {
                        stt: i,
                        name: "Mã giảm giá "+ strValue,
                        value: value,
                        condition: "Áp dụng cho đơn hàng >= "+ condition,
                        valueCondition: valueCondition,
                        choose: false
                    }
                    listDiscount.push(singleVoucher);
                    listVoucher.push(singleVoucher);
                }
                modalDiscount.setState({listVoucher: listVoucher});
            } else {
                modalDiscount.setState({listVoucher:[]})
            }
        })
    }
    render(){
        var sumCost = 0;
        this.state.sumcost.forEach(e => {
            sumCost+=e;
        });
        sumCostProduct = sumCost;
        var subCost = (sumCost-this.state.costVoucher).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        sumCost = sumCost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right	"></i></span>
                        <span>Thanh toán</span>
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
                                    <td class="cart_voucher" colspan="3" rowspan="5"></td>
                                    <td class="text-right" colspan="3">Tổng tiền sản phẩm</td>
                                    <td id="total_product" class="price" colspan="1">{sumCost}</td>
                                </tr>
                                <tr>
                                    <td class="text-right" colspan="3">Tổng tiền vận chuyển</td>
                                    <td id="total_shipping" class="price" colspan="1">Chưa xác định</td>
                                </tr>
                                <tr>
                                    <td class="text-right" colspan="3">Voucher giảm giá</td>
                                    <td id="total_shipping" class="price" colspan="1">
                                    <a class='btn btn-danger' data-toggle='tooltip' style={{cursor:'pointer',marginLeft:'3px'}} title='Mã giảm giá' data-toggle="modal" 
                                    data-target="#modalDiscount" onClick={this.discount}>Chọn mã</a>
                                    </td>
                                </tr>
                                {this.state.costVoucher!=0 ?
                                 <tr>
                                    <td class="text-right" colspan="3">Giảm giá:</td>
                                    <td id="total_shipping" class="price" colspan="1">
                                        -{this.state.costVoucher.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                                    </td>
                                </tr>:""}
                                <tr>
                                    <td class="total-price-container text-right" colspan="3">
                                        <span>Tổng</span>
                                    </td>
                                    <td id="total-price-container" class="price" colspan="1">
                                        <span id="total-price">{subCost} (tạm tính)</span>
                                    </td>
                                </tr>
                            </tfoot>									
                        </table>   
                    </div>
                </div>              
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="returne-continue-shop">
                        <a href="/" class="continueshoping"><i class="fa fa-chevron-left" type='submit'></i>Tiếp tục mua hàng</a>
                        {
                        this.state.listProduct.length>0?<a class="procedtocheckout" onClick={this.goStep2} style={{cursor:'pointer'}}>Tiếp tục thanh toán<i class="fa fa-chevron-right"></i></a>:
                        <a class="procedtocheckout" style={{cursor:'pointer', color:"gray"}}>Tiếp tục thanh toán<i class="fa fa-chevron-right"></i></a>}
                    </div>						
                </div>
            </div>
        </div>
        <ModalDiscount/>
    </section>)
    }   
}
class GoogleMap extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            position:{},

        }
        map = this;
    }
    render(){
        var url = "https://maps.google.com/maps?q="+this.state.position.lat+","+this.state.position.lng+"&t=&z=13&ie=UTF8&iwloc=&output=embed";
        if (this.state.position.text){
            url = "https://maps.google.com/maps?q="+this.state.position.text+"&ie=UTF8&iwloc=&output=embed";
        }
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
var classLocation, classAddress, dataSendMail;
class LocationSearchInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = { address: '' };
      this.handleChange = this.handleChange.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      classLocation = this;
    }
    handleChange(address){
        this.setState({address:address});
    }
    handleSelect(address){
        var that = this;
        geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
            that.setState({address:address});
            $.post("/getPosition",{address:address},function(data){
                if (data.err!=""){
                    classAddress.setState({err:data.err})
                } else {
                    map.setState({position:data.position});
                }
            })
        })
        .catch(error => console.error('Error', error));
    }
    render() {
      return (
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#9c9b98', cursor: 'pointer', border: "solid #9c9b98 1px", color:"black"}
                    : { backgroundColor: '#ffffff', cursor: 'pointer',border: "solid #9c9b98 1px", color:"black"};
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      );
    }
}
class Address extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            err:"",
            user : {}
        }
        this.addAddress = this.addAddress.bind(this);
        this.backStep1 = this.backStep1.bind(this);
        classAddress = this;
    }
    componentDidMount(){
        var that = this;
        var emailUser = localStorage.getItem("email");
        $.post("/getSingleUser",{email:emailUser},function(data){
            that.setState({user:data});
            if (data.address){
                classLocation.setState({address: data.address});
                map.setState({position:{text:data.address}});
            }
        })
    }
    addAddress(e){
        e.preventDefault();
        var address = classLocation.state.address;
        var fullname = this.refs.fullname.value;
        var phonenumber = this.refs.phonenumber.value;
        var email = localStorage.getItem("email");
        var voucher = step1.state.costVoucher;
        var that = this;
        var sumCost = 0;
        step1.state.sumcost.forEach(e => {
            sumCost+=e;
        });
        $.post("/updateAddress",{id:localStorage.getItem('curorder'),email:email,address:address, fullname:fullname,
        phonenumber:phonenumber, sumcost:sumCost, voucher:voucher},function(data){
            if (data.err == 0) {
                dataSendMail = data;
                main.setState({curStep:3});
                // $.post("/sendmail", { order: JSON.stringify(data.data), id: localStorage.getItem('curorder'), ship:data.ship}, function (data) {
                //     main.setState({ curStep: 3 });
                // })
            } else {
                that.setState({err:"Vui lòng kiểm tra lại địa chỉ"})
            }
        })
    }
    backStep1(){
        main.setState({curStep:1});
    }
    render(){
        if (!localStorage.getItem("curorder")) window.location.replace("/");
        var name="", number="";
        if (this.state.user){
            if (this.state.user.firstName) name += this.state.user.firstName;
            if (this.state.user.lastName) name += this.state.user.lastName;
            if (this.state.user.numberPhone) number = this.state.user.numberPhone;
        }
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>Thanh toán</span>
                    </div>
                </div>
            </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2 class="page-title">Thông tin khách hàng</h2>
                </div>	
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-todo first step-done" onClick={this.backStep1}>
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
                        <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 col-md-push-3 col-xs-push-1 col-sm-push-1">
                            <label>Họ và tên</label>
                            <input type="text" placeholder="Tên" name="name" required ref="fullname" defaultValue={name}/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 col-md-push-3 col-xs-push-1 col-sm-push-1">
                            <label>Số điện thoại</label>
                            <input type="text" placeholder="Số điện thoại" name="numberphone" required ref="phonenumber" defaultValue={number}/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-8 col-sm-8 col-md-6 col-lg-6 col-md-push-3 col-xs-push-1 col-sm-push-1">
                            <label>Địa chỉ:</label>
                            <LocationSearchInput/>
                        </div>
                    </div>
                    <div class="row text-center">
                            <GoogleMap/>
                    </div>		                        
                    <h3 style={{color:'red'}} className='text-center'>{this.state.err}</h3>
                    <div class="row">
                        <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 col-md-push-3 col-xs-push-1 col-sm-push-1">
                            <button type="submit" class="btn btn-danger">Tiếp tục thanh toán</button>
                        </div>
                    </div>
                </form>			
            </div>
        </div>
    </section>)
    }
}
var chooseOption = -1, curCode="",phone;
class Confirm extends React.Component {
    constructor(props){
        super(props);
        this.backStep1 = this.backStep1.bind(this);
        this.backStep2 = this.backStep2.bind(this);
        this.state = {  
            isSendMail: -1,
            errOption: "",
            inforMail:"",
            inforSMS: "",
            errPhone:""
        }
    }
    backStep1(){
        main.setState({curStep:1});
    }
    backStep2(){
        main.setState({curStep:2});
    }
    changeOption(e){
        chooseOption = e.target.value;
    }
    continueConfirm(){
        if (chooseOption==-1){
            this.setState({errOption:"Bạn chưa chọn hình thức xác nhận đơn hàng"});
        } else if (chooseOption==1){
            var id = localStorage.getItem('curorder');
            $.post("/sendmail", { order: JSON.stringify(dataSendMail.data), id: id, ship:dataSendMail.ship}, function (data) {
                    main.setState({ curStep: 3 });
            })
            this.setState({isSendMail:1})
        } else {
            this.setState({isSendMail:0})
        }
    }
    sendSMS(){
        var that = this;
        phone = this.refs.phone.value;
        var phoneno = /^\d{10}$/;
        if (phone[0]=='8'&&phone[1]=='4')  phoneno = /^\d{11}$/
        var id = localStorage.getItem('curorder');
        if(phone.match(phoneno)){
            $.post("/sendSMS",{phone:phone,order: JSON.stringify(dataSendMail.data), id: id, ship:dataSendMail.ship},function(data){
                if (data.err==1){
                    that.setState({errPhone:"Quá trình gửi SMS xảy ra lỗi. Vui lòng thử lại"})
                } else {
                    curCode = data.code;
                    that.setState({isSendMail:3})
                }
            })
        } else {
            that.setState({errPhone:"Định dạng số điện thoại chưa đúng. Hãy kiểm tra lại"})
        }
    }
    reSendEmail(){
        var that = this;
        var id = localStorage.getItem('curorder');
        that.setState({inforMail:""});
        $.post("/sendmail", { order: JSON.stringify(dataSendMail.data), id: id, ship:dataSendMail.ship}, function (data) {
            that.setState({inforMail:"Đã gửi thành công!"});
    })
    }
    reSendSMS(){
        var that = this;
        var id = localStorage.getItem('curorder');
        that.setState({inforSMS:""})
        $.post("/sendSMS",{phone:phone,order: JSON.stringify(dataSendMail.data), id: id, ship:dataSendMail.ship},function(data){
            if (data.err==1){
                that.setState({inforSMS:"Quá trình gửi SMS xảy ra lỗi. Vui lòng thử lại"});
            } else {
                curCode = data.code;
                that.setState({inforSMS:"Đã gửi thành công!"});
            }
        })
    }
    continueCheckout(){
        var code = this.refs.codeConfirm.value;
        if (code==curCode.toString()){
          location.assign("/confirm/"+phone+"/"+code)
        } else {
            this.setState({inforSMS:"Mã xác nhận không đúng!"})
        }
    }
    render(){
        var that = this;
        return(<section class="main-content-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i class="fa fa-caret-right"></i></span>
                        <span>Thanh toán</span>
                    </div>
                </div>
            </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h2 class="page-title">Xác nhận đơn hàng</h2>
                </div>	
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="shoping-cart-menu">
                        <ul class="step">
                            <li class="step-todo first step-done" onClick={this.backStep1}>
                                <span><a href="/checkout">01. Tổng kết</a></span>
                            </li>                   
                           
                            <li class="step-todo second step-done" onClick={this.backStep2}>
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
            {(()=>{
                if (that.state.isSendMail==-1){
                    return (
                        <div class="row text-center">
                        <h4>Chọn hình thức xác nhận đơn hàng</h4>
                        <div class="form-check" onChange={that.changeOption.bind(that)}>
                          <input
                            class="form-check-input addr" type="radio" name="radio-confirm" id="sendEmail" value="1"/>
                          <label class="form-check-label" for="sendEmail">
                            Xác nhận qua Email
                          </label>
                          <br/>
                          <input
                            class="form-check-input addr" type="radio" name="radio-confirm" id="sendSMS" value="0"/>
                          <label class="form-check-label" for="sendSMS">
                            Xác nhận qua SMS
                          </label>
                        </div>
                        <button class="btn btn-success btnContinue button addr" onClick={that.continueConfirm.bind(that)}>Tiếp tục</button>
                        <h4 class="err text-center addr">{that.state.errOption}</h4>
                      </div>
                    );
                } else if (that.state.isSendMail==1){
                    return(<div class="row text-center">
                            <h3 class="text-center addr">Một email đã được gửi vào vào tài khoản email của bạn!</h3>
                            <h3 class="text-center addr">Vui lòng vào email để xác nhận đơn hàng!</h3>	                       
                            <button class="btn btn-danger button addr" onClick={that.reSendEmail.bind(that)}>Gửi lại email</button>	
                            <h4 class="infor text-center addr">{that.state.inforMail}</h4>
                    </div>)
                } else if (that.state.isSendMail==0){
                    return (
                      <div class="row">
                        <div class="form-group text-center">
                          <label for="phonenumber">Nhập số điện thoại:</label>
                          <input
                            type="tel" class="form-control addr"
                            id="phonenumber" placeholder="Nhập số điện thoại" ref="phone"/>
                        </div>
                        <div class="form-group text-center">
                          <button class="btn btn-success button addr" onClick={that.sendSMS.bind(this)}>Tiếp tục</button>
                        </div>
                        <div class="form-group text-center">
                          <h4 class="err addr">{that.state.errPhone}</h4>
                        </div>
                      </div>
                    );
                } else if (that.state.isSendMail==3){
                    return(<div class="row">
                        <h3 class="text-center addr">Một mã xác nhận đã được gửi đến số điện thoại của bạn!</h3>
                        <h3 class="text-center addr">Vui lòng nhập chính xác mã xác nhận để tiếp tục:</h3>
                        <input type="text" ref="codeConfirm" class="form-control code-input addr" placeholder="Nhập mã xác nhận"/>
                        <button class="btn btn-primary button addr" onClick={that.continueCheckout.bind(that)}>Tiếp tục</button>
                        <button class="btn btn-danger button addr" onClick={that.reSendSMS.bind(that)}>Gửi lại SMS</button>	
                            <h4 class="infor text-center">{that.state.inforSMS}</h4>	
                    </div>)
                }
            })()}
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
        initizeAnalytics();
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