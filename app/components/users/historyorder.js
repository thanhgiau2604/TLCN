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
import ReactGA from 'react-ga'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
function formatCurrency(cost){
	return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
var mainOrder;

class ItemHistory extends React.Component{
    constructor(props){
        super(props);
        this.getDetail = this.getDetail.bind(this);
    }
    getDetail(){
		localStorage.setItem("curproduct",this.props.id);
		window.location.assign("/detailproduct")
    }
    render()
    {
        return (<div className="col-md-3 col-sm-4 col-xs-12">
            <div className="wishlists-single-item">
                <div className="wishlist-image">
                    <a onClick={this.getDetail} style={{cursor:'pointer'}}><img src={this.props.image} alt="" /></a>
                </div>
                <div className="wishlist-title">
                <a onClick={this.getDetail} style={{cursor:'pointer'}}><p>{this.props.name}</p></a>
                </div>
            </div>
        </div>)
    }
}
class ListHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listHis : [],
            curpage:1
        }
        this.changePage = this.changePage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.delHistory = this.delHistory.bind(this);
    }
    changePage(value, event) {
        this.setState({ curpage: value });
    }
    previousPage(){
        if (this.state.curpage>1)
              this.setState({curpage:this.state.curpage-1});
    }
    nextPage(){
        var length = this.state.listHis.length;
        var perpage = 4;
        if (this.state.curpage<Math.ceil(length / perpage))
              this.setState({curpage:this.state.curpage+1});
    }
    componentDidMount(){
        var that = this;
        var token = localStorage.getItem('token');
        if (token){
            $.get("/api", { token: token }, function (data) {
                if (data.success == 1) {
                    $.post("/productHistory",{email:localStorage.getItem('email')},function(data){
                        that.setState({listHis:data});
                    }) 
                }
            })
        }
    }

    delHistory(){
        var that = this;
        $.post("/delHistory",{email:localStorage.getItem('email')},function(data){
            that.setState({listHis:data});
        })
    }
    render()
    {
        var page = "";
        var lCurHis = [];
        var length = this.state.listHis.length;
        if (length != 0) {
            page = [];
            var perpage = 4;
            var start = (this.state.curpage - 1) * perpage;
            var finish = (start + perpage);
            if (finish > length) finish = length;
            lCurHis = this.state.listHis.slice(start, start + perpage);
            var numberpage = Math.ceil(length / perpage);
            for (var i = 1; i <= numberpage; i++) {
                if (this.state.curpage == i) {
                    page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
                } else {
                    page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
                }
            }
        }
        return (<div>
            <div className="row">
            <h3><b>Các sản phẩm đã xem</b></h3>
            <button class="btn btn-danger" style={{ display: 'inline', marginTop: '20px' }} onClick={this.delHistory}>
                Xóa lịch sử xem sản phẩm</button>
            
                <div style={{ paddingTop: '20px' }}>
                    {lCurHis.map(function (pro, index) {
                        return <ItemHistory key={index} name={pro.name} image={pro.image.image1} id={pro._id} />
                    })}
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
                    Hiển thị từ {start + 1} đến {finish} trên {this.state.listHis.length} sản phẩm
                </div>
            </div>
        </div> )
    }
}
class HistoryOrder extends React.Component{
    constructor(props){
        super(props);
    }

    render()
    {
        initizeAnalytics();
        $.post("/addNewDay",function(data){
            
        })
        return(<section className="main-content-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    
                    <div className="bstore-breadcrumb">
                        <a href="/">Trang chủ<span><i className="fa fa-caret-right"></i> </span> </a>
                        <a href="/manageaccount">QL Tài khoản<span><i className="fa fa-caret-right"></i></span></a>
                        <span>Danh sách đơn hàng</span>
                    </div>
                   
                </div>
            </div>
            <div className="row">					
                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 col-md-push-1">
                    <h2 className="page-title text-center">DANH SÁCH ĐƠN HÀNG</h2>
                    <div className="wishlists-chart table-responsive">
                        <TableOrder/>
                    </div>	       
                    <div className="wishlists-item">
                        <div className="wishlists-all-item">
                            <ListHistory/>                 
                            <div className="wish-back-link">
                               
                            </div>                     
                        </div>
                    </div>	             
                </div>
            </div>
        </div>
    </section>)
    }
}
class RowProduct extends React.Component {
    constructor(props){
        super(props);
    }
    cancelProduct(){
        var idProduct = this.props.product.id;
        var email = localStorage.getItem("email");
        var idOrder = this.props.idOrder;
        $.post("/cancelProduct",{idProduct:idProduct, idOrder:idOrder,email:email},function(data){
            console.log(data);
            mainOrder.setState({listOrder:data});
        });
    }
    render(){
        return(<div class="item-product">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 display-product">
          <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2">
            <div class="imgOrder">
              <img src={this.props.product.image} width="120px"/>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-8 col-lg-8">
            <div class="itemDetail">
              <div class="item-name">{this.props.product.name}</div>
              <div class="item-variation">Phân loại hàng: {this.props.product.size}, {this.props.product.color}</div>
              <div class="item-quantity"> x {this.props.product.quanty}</div>
              <div class="item-price">
                  <div class="item-current-price"><b>{formatCurrency(this.props.product.cost)}</b></div>
               </div>
            </div>
          </div>    
          <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 wrapper-cancel-product">
                <div class="cancel-product">
                    {this.props.product.status=="canceled" ? <h4 class="infor-status-product">Đã hủy</h4> :
                    ( this.props.product.status=="confirmed" &&
                    (!this.props.paymentMethod || this.props.paymentMethod=="cash")?
                    <button class="btn btn-danger" onClick={this.cancelProduct.bind(this)}>
                        <i class="fa fa-times" aria-hidden="true"></i> Hủy
                    </button> : "")
                    }
                </div>
            </div>     
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="line"></div>
        </div>   
      </div>)
    }
}
class ListOrders extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listOrder: [],
            permission:0,
            processing:[]
        }
        this.cancelOrder = this.cancelOrder.bind(this);
        mainOrder = this;
    }
    componentDidMount(){
        var that = this;
        var token = localStorage.getItem('token');
        if (!token) {
            this.setState({ permission: 0 });
        }
        $.get("/api", { token: token }, function (data) {
            if (data.success == 1) {
                that.setState({ permission: 1 });
                $.post("/getListOrder",{email:localStorage.getItem('email')},function(data){
                    that.setState({listOrder:data});
                })
            }
        })
    }
    cancelOrder(order,index){
        var that = this;
        var idOrder = order._id;
        var email = localStorage.getItem("email");
        var arrProcessing = this.state.processing;
        arrProcessing[index] = true;
        this.setState({processing:arrProcessing});
        if (!order.paymentMethod || order.paymentMethod=="cash"){
            $.post("/cancelOrder",{idOrder:idOrder,email:email},function(data){
                that.setState({listOrder: data});
                NotificationManager.success( 'Hủy đơn hàng thành công', 'Thông báo',4000);
                arrProcessing[index] = false;
                that.setState({processing:arrProcessing});
            })
        } else 
        if (new Date().getTime()-order.timestamp<=86400000){
            const strErr = 'Đã xảy ra lỗi trong quá trình hoàn tiền, thử lại sau!';
            const strSuccess = 'Hủy đơn hàng và hoàn tiền thành công';
            if (order.paymentMethod=="paypal"){
                $.post("/paypalrefund",{idSale:order.paypalSale.idSale,total:order.paypalSale.amount},function(data){
                    if (data.success==true){
                        $.post("/cancelOrder",{idOrder:idOrder,email:email},function(data){
                            that.setState({listOrder: data});
                            NotificationManager.success(strSuccess, 'Thông báo', 4000);
                            arrProcessing[index] = false;
                            that.setState({processing:arrProcessing});
                        })
                    } else {
                        NotificationManager.error(strErr,'Thông báo',5000);
                        arrProcessing[index] = false;
                        that.setState({processing:arrProcessing});
                    }
                })
            } else
            if (order.paymentMethod=="stripe"){
                $.post("/stripeRefund",{chargeId:order.stripeChargeId},function(data){
                    if (data.refund==true){
                        $.post("/cancelOrder",{idOrder:idOrder,email:email},function(data){
                            that.setState({listOrder: data});
                            NotificationManager.success(strSuccess, 'Thông báo', 4000);
                            arrProcessing[index] = false;
                            that.setState({processing:arrProcessing});
                        })
                    } else {
                        NotificationManager.error(strErr,'Thông báo',5000);
                        arrProcessing[index] = false;
                        that.setState({processing:arrProcessing});
                    }
                })
            }
        } else {
            NotificationManager.error(
            'Đã vượt quá 24h cho phép để hủy đơn hàng khi thanh toán online', 'Thông báo', 5000);
            arrProcessing[index] = false;
            that.setState({processing:arrProcessing});
        }
    }
    goLogin(){
        window.location.replace("/");
    }
    changeOptionDisplay(e){

    }
    changeDate(e){
        
    }
    render(){
        var that = this;
        if (this.state.permission==0){
            return(<div className="text-center">
            <br />
            <h3>Để thực hiện chức năng này bạn phải đăng nhập!</h3>
            <button className="btn btn-primary" onClick={this.goLogin.bind(this)} style={{ marginTop: '10px' }}>Đi đến trang đăng nhập</button>
        </div>)
        } else
        return(<div class="container" style={{marginTop:"30px"}}>
         <NotificationContainer />
        <div class="row">
        <div class="text-center" style={{paddingTop:"30px",paddingBottom:"20px"}}>
            <h2><b>DANH SÁCH ĐƠN HÀNG</b></h2>
        </div>
        <div class="text-center" style={{paddingBottom:"30px"}}>
                    <div
                        class="radio classOption"
                        onChange={this.changeOptionDisplay.bind(this)}>
                        <label>
                            <input
                                class="with-gap" name="date" type="radio" value="all" defaultChecked="true"/>
                            <span>Tất cả</span>
                        </label>
                        <label>
                            <input
                                class="with-gap" name="date" type="radio" value="specific"/>
                            <span>Ngày cụ thể:</span>
                        </label>
                        <input
                            class="with-gap" type="date" name="specificDate" ref="specificDate"
                            onChange={this.changeDate.bind(this)}
                        />
                    </div>
                </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="panel-group" id="accordion">
        {this.state.listOrder.map(function(order,index){
            return(<div class="panel panel-default" key={index}>
            <div class="panel-heading">
              <h4 class="panel-title">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href={"#collapse"+index}>
                  <b class="title-order">#{index+1}: Đơn hàng #{order.code} ngày {order.time}</b>
                </a>
                <span class="status-order">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="col-md-4">
                                {order.payment==true ?
                                (order.paymentMethod=="paypal" ? <img src="img/paypal.png" width="30%"/> :
                                (order.paymentMethod=="stripe" ? <img src="img/stripe.png" width="30%"/> :
                                (order.paymentMethod=="vnpay" ? <img src="img/vnpay.png" width="30%"/> :
                                (order.paymentMethod=="zalopay" ? <img src="img/zalopay.png" width="30%"/>:
                                <h4>Đã thanh toán khi nhận hàng</h4>))))
                                : <div></div>
                                }
                            </div>
                            <div class="col-md-5">
                                <i class="fa fa-commenting-o" aria-hidden="true"></i>Trạng thái đơn hàng:<span class="detail-status"> {order.status}</span>
                            </div>
                            <div class="col-md-3">
                                {order.status == "canceled" ?
                                <h4 class="infor-status-product">Đã hủy</h4> :
                                (order.status == "confirmed" || 
                                (order.status=="Payment Success" && (new Date().getTime()-order.timestamp<=86400000))?
                                <button class="btn btn-warning cancel-order" onClick={() => that.cancelOrder(order,index)}>
                                <i class="fa fa-times" aria-hidden="true"></i> Hủy đơn hàng</button> : 
                                 <button class="btn btn-warning cancel-order" disabled="true">
                                 <i class="fa fa-times" aria-hidden="true"></i> Hủy đơn hàng
                                 </button>)}
                                 {that.state.processing[index]==true ? <div class="loader text-center wait-refund"></div> : <div></div>}
                            </div>
                        </div>
                    </div>
                </span>          
              </h4>
            </div>
            <div id={"collapse"+index} class="panel-collapse collapse in">
              <div class="panel-body">
                <div class="list-product">
                {order.listproduct.map(function(product,pos){
                    return(<RowProduct key={pos} product={product} idOrder = {order._id}
                    paymentMethod = {order.paymentMethod}/>)
                })}  
                </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 infor-cost">
                      <div class="col-xs-5 col-sm-5 col-md-7 col-lg-7"></div> 
                      <div class="col-xs-7 col-sm-7 col-md-5 col-lg-5">
                          <h3><i class="fa fa-shopping-bag" aria-hidden="true"></i>
                            Tổng tiền sản phẩm: <span class="display-cost">{formatCurrency(order.sumproductcost)}</span></h3>
                          <h3><i class="fa fa-motorcycle" aria-hidden="true"></i>
                            Ship: <span class="display-cost">{formatCurrency(order.sumshipcost)}</span></h3>
                          {order.costVoucher ? <h3><i class="fa fa-gift" aria-hidden="true"></i>
                            Voucher sử dụng: <span class="display-cost">{formatCurrency(order.costVoucher)}</span></h3> : ""}
                          <h3 class="total-order"><i class="fa fa-file-text" aria-hidden="true"></i>
                            <b>Tổng tiền đơn hàng: <span class="display-cost">
                                {order.costVoucher ? formatCurrency(order.sumproductcost+order.sumshipcost-order.costVoucher) :
                                formatCurrency(order.sumproductcost+order.sumshipcost)}
                                </span></b></h3>
                      </div> 
                  </div>   
              </div>
            </div>
          </div>)
        })}
        </div>
      </div>
    </div> 
        </div>)
    }
}
const History = connect(function(state){  
})(ListOrders)


ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <History/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("historyorder")
)