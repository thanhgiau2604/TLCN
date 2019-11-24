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

class RowOrder extends React.Component{
    constructor(props){
        super(props);
    }
    render()
    {
        return(<tr className="text-center">
        <td className="text-center">{this.props.stt}</td>
        <td className="text-center">{this.props.name}</td>
        <td className="text-center"><img src={this.props.image} width="100px" height="100px"/></td>
        <td className="text-center"><button className="btn btn-warning">{this.props.status}</button></td>
      </tr>)
    }
}
class TableOrder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listorder : []
        }    
    }
    componentDidMount(){
        var that = this;
        $.post("/getOrder",{email:localStorage.getItem('email')},function(data){
            that.setState({listorder:data});
        })
    }
    render()
    {
        return(<table className="table table-hover text-center">
        <thead>
          <tr>
            <th className="text-center">STT</th>
            <th className="text-center">Tên sản phẩm</th>
            <th className="text-center">Hình ảnh</th>
            <th className="text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listorder.map(function(order,index){
              return <RowOrder key={index} name={order.product.name}
            image ={order.product.image.image1} status={order.status} stt={index+1}/>
          })}
        </tbody>
      </table>)
    }
}
class ItemHistory extends React.Component{
    constructor(props){
        super(props);
    }
    render()
    {
        return (<div className="col-md-3 col-sm-4 col-xs-12">
            <div className="wishlists-single-item">
                <div className="wishlist-image">
                    <a href="#"><img src={this.props.image} alt="" /></a>
                </div>
                <div className="wishlist-title">
                    <p>{this.props.name}<a href="#"><i className="fa fa-close"></i></a></p>
                </div>
            </div>
        </div>)
    }
}
class ListHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listHis : []
        }
        this.delHistory = this.delHistory.bind(this);
    }
    componentDidMount(){
        var that = this;
        $.post("/productHistory",{email:localStorage.getItem('email')},function(data){
            that.setState({listHis:data});
        })
    }

    delHistory(){
        var that = this;
        $.post("/delHistory",{email:localStorage.getItem('email')},function(data){
            that.setState({listHis:data});
        })
    }
    render()
    {
        return(<div className="row">
        <h3><b>Các sản phẩm đã xem</b></h3>
        <button class="btn btn-danger" style={{display:'inline', marginTop:'20px'}} onClick={this.delHistory}>
            Xóa lịch sử xem sản phẩm</button>
        <div style={{paddingTop:'20px'}}>  
        {this.state.listHis.map(function(pro,index){
            return <ItemHistory key={index} name={pro.name} image = {pro.image.image1} />
        })}   
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
        return(<section className="main-content-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    
                    <div className="bstore-breadcrumb">
                        <a href="index.html">Trang chủ<span><i className="fa fa-caret-right"></i> </span> </a>
                        <a href="my-account.html">QL Tài khoản<span><i className="fa fa-caret-right"></i></span></a>
                        <span>Danh sách đơn hàng</span>
                    </div>
                   
                </div>
            </div>
            <div className="row">					
                <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12 col-md-push-2">
                    <h2 className="page-title text-center">DANH SÁCH ĐƠN HÀNG</h2>
                    <div className="wishlists-chart table-responsive">
                        <TableOrder/>
                    </div>	       
                    <div className="wishlists-item">
                        <div className="wishlists-all-item">
                            <ListHistory/>                 
                            <div className="wish-back-link">
                                <a  className="wish-save" href="my-account.html"><i className="fa fa-chevron-left"></i> QL Tài khoản</a>
                                <a  className="wish-save" href="index-2.html"><i className="fa fa-chevron-left"></i> Trang chủ</a>
                            </div>                     
                        </div>
                    </div>	             
                </div>
            </div>
        </div>
    </section>)
    }
}

const History = connect(function(state){  
})(HistoryOrder)


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