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

class RowFavorite extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(){
        $.post("/deleteFav",{idDel:this.props.id,email:localStorage.getItem('email')},function(data){
            table.setState({listFav:data});
            items.setState({listFav:data});
        })
    }
    render(){
        return(<tr className="text-center">
            <td className="text-center">{this.props.pos}</td>
            <td className="text-center">{this.props.name}</td>
            <td className="text-center"><button className="btn btn-danger" 
            onClick={this.handleDelete}>Xóa</button></td>
          </tr>)
    }
}
var items,table;
class TableFavorite extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listFav:[]
        }
        table=this;
    }
    componentDidMount(){
        var that = this;
        $.post("/productFavorite",{email:localStorage.getItem('email')},function(data){
            that.setState({listFav:data});
            items.setState({listFav:data});
        })
    }
    render(){
        return (
        <table className="table table-hover text-center">
        <thead>
          <tr>
            <th className="text-center">STT</th>
            <th className="text-center">Tên sản phẩm</th>
            <th className="text-center">Xóa khỏi FavoriteList</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listFav.map(function(product,index){
              return <RowFavorite key={index} pos={index+1} name={product.name}
              id={product._id}/>
          })}
        </tbody>
      </table>)
    }
}

class Item extends React.Component{
    constructor(props){
        super(props);
        this.handleClose=this.handleClose.bind(this);
    }
    handleClose(){
        $.post("/deleteFav",{idDel:this.props.id,email:localStorage.getItem('email')},function(data){
            table.setState({listFav:data});
            items.setState({listFav:data});
        })
    }
    render(){
        return(<div className="col-md-3 col-sm-4 col-xs-12">                          
        <div className="wishlists-single-item">
            <div className="wishlist-image">
                <a href="#"><img src={this.props.image} /></a>
            </div>
            <div className="wishlist-title text-center">
                <p>{this.props.name} <a onClick={this.handleClose}><i className="fa fa-close"></i></a></p>
            </div>									
        </div>
    </div>)
    }
}
class ListItems extends React.Component{
    constructor(props){
        super(props);
        items = this;
        this.state = {
            listFav:[]
        }
    }
    render(){
        return( <div className="row">
        	{this.state.listFav.map(function(item,index){
                return <Item id={item._id} name={item.name} image={item.image.image1}/>
            })}						
        </div>)
    }
}
class ListFavorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: 0
        }
        this.goLogin = this.goLogin.bind(this);
    }
    componentDidMount() {
        var token = localStorage.getItem('token');
        if (!token) {
            this.setState({ permission: 0 });
        }
        var that = this;
        $.get("/api", { token: token }, function (data) {
            if (data.success == 1) {
                that.setState({ permission: 1 });
            }
        })
    }
    goLogin(){
        window.location.replace("/login");
    }
    render() {
        $.post("/addNewDay",function(data){
            
        })
        if (this.state.permission == 0) {
            return (<div className="text-center">
                <br/>
                <h3>Để thực hiện chức năng này bạn phải đăng nhập!</h3>
                <button className="btn btn-primary" onClick={this.goLogin} style={{marginTop:'10px'}}>Đi đến trang đăng nhập</button>
            </div>)
        } else {
            return (<section className="main-content-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="bstore-breadcrumb">
                                <a href="/">Trang chủ<span><i className="fa fa-caret-right"></i> </span> </a>
                                <a href="/manageaccount">QL Tài khoản<span><i className="fa fa-caret-right"></i></span></a>
                                <span>Danh sách sản phẩm yêu thích</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 className="page-title text-center" style={{ color: 'blue', fontWeight: '700', paddingBottom: '20px' }}>DANH SÁCH SẢN PHẨM YÊU THÍCH</h1>
                            <div className="wishlists-chart table-responsive">
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-md-push-2">
                                    <TableFavorite />
                                </div>
                            </div>
                            <div className="wishlists-item">
                                <div className="wishlists-all-item">
                                    <ListItems />
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
}

const Favorite = connect(function(state){  
})(ListFavorite)

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop />
        <HeaderMiddle />
        <MainMenu />
        <Favorite/>
        <CompanyFacality />
        <Footer />
        <CopyRight />
    </Provider>, document.getElementById("favoriteList")
)