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
function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
class RowFavorite extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(){
        $.post("/deleteFav",{idDel:this.props.id,email:localStorage.getItem('email')},function(data){
            if (Math.ceil(data.length / 3)<table.state.curpage){
                table.setState({curpage:table.state.curpage-1});
            }
            if (Math.ceil(data.length / 8)<items.state.curpage){
                items.setState({curpage:items.state.curpage-1});
            }
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
            listFav:[],
            curpage: 1
        }
        this.changePage = this.changePage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        table=this;
    }
    changePage(value, event) {
        this.setState({ curpage: value });
    }
    previousPage(){
        if (this.state.curpage>1)
              this.setState({curpage:this.state.curpage-1});
    }
    nextPage(){
        var length = this.state.listFav.length;
        var perpage = 3;
        if (this.state.curpage<Math.ceil(length / perpage))
              this.setState({curpage:this.state.curpage+1});
    }
    componentDidMount(){
        var that = this;
        $.post("/productFavorite",{email:localStorage.getItem('email')},function(data){
            that.setState({listFav:data});
            items.setState({listFav:data});
        })
    }
    render(){
        var page = "";
        var lCurFav = [];
        var length = this.state.listFav.length;
        if (length!=0){
            page = [];
            var perpage = 3;
            var start = (this.state.curpage - 1) * perpage;
            var finish = (start+perpage);
            if (finish>length) finish=length;
            lCurFav = this.state.listFav.slice(start, start + perpage);
            var numberpage = Math.ceil(length / perpage);
            for (var i = 1; i <= numberpage; i++) {
                if (this.state.curpage == i) {
                    page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
                } else {
                    page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
                }
            }
        }
        return (
        <div>
        {this.state.listFav.length>0 ?
        <div>
            <table className="table table-hover text-center">
                <thead>
                    <tr>
                        <th className="text-center">STT</th>
                        <th className="text-center">Tên sản phẩm</th>
                        <th className="text-center">Xóa khỏi FavoriteList</th>
                    </tr>
                </thead>
                <tbody>
                    {lCurFav.map(function (product, index) {
                        return <RowFavorite key={index} pos={start+(index + 1)} name={product.name}
                            id={product._id} />
                    })}
                </tbody>
            </table>
            <div class='panel-footer'>
                <ul class='pagination pagination-sm'>
                    <li>
                        <a style={{cursor:'pointer'}} onClick={this.previousPage}>«</a>
                    </li>
                    {page}
                    <li>
                        <a style={{cursor:'pointer'}} onClick={this.nextPage}>»</a>
                    </li>
                </ul>
                <div class='pull-right'>
                    Hiển thị từ {start + 1} đến {finish} trên {this.state.listFav.length} sản phẩm
            </div>
            </div>
        </div> : <div className="text-center">Chưa có sản phẩm yêu thích</div>}
        </div>)
    }
}

class Item extends React.Component{
    constructor(props){
        super(props);
        this.handleClose=this.handleClose.bind(this);
    }
    handleClose(){
        $.post("/deleteFav",{idDel:this.props.id,email:localStorage.getItem('email')},function(data){
            if (Math.ceil(data.length / 8)<items.state.curpage){
                items.setState({curpage:items.state.curpage-1});
            }
            if (Math.ceil(data.length / 3)<table.state.curpage){
                table.setState({curpage:table.state.curpage-1});
            }
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
            listFav:[],
            curpage:1
        }
        this.changePage = this.changePage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }
    changePage(value, event) {
        this.setState({ curpage: value });
    }
    previousPage(){
        if (this.state.curpage>1)
              this.setState({curpage:this.state.curpage-1});
    }
    nextPage(){
        var length = this.state.listFav.length;
        var perpage = 8;
        if (this.state.curpage<Math.ceil(length / perpage))
              this.setState({curpage:this.state.curpage+1});
    }
    render(){
        var page = "";
        var lCurFav = [];
        var length = this.state.listFav.length;
        if (length!=0){
            page = [];
            var perpage = 8;
            var start = (this.state.curpage - 1) * perpage;
            var finish = (start+perpage);
            if (finish>length) finish=length;
            lCurFav = this.state.listFav.slice(start, start + perpage);
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
        {this.state.listFav.length>0 ?
        <div>
            <div className="row">
                {lCurFav.map(function (item, index) {
                    return <Item id={item._id} name={item.name} image={item.image.image1} />
                })}
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
                    Hiển thị từ {start + 1} đến {finish} trên {this.state.listFav.length} sản phẩm
                </div>
            </div>
        </div> : <div></div>}
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
        initizeAnalytics();
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
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 col-md-push-2">
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