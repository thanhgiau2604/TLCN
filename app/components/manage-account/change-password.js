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

class PasswordForm extends React.Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            err:"",
            message:"",
            permission: 0
        }
        this.goLogin = this.goLogin.bind(this);
    }
    handleSubmit(e){
        var that=this;
        var email= localStorage.getItem('email');
        $.post("/changepassword",{oldpass:this.oldpass.value,newpass:this.newpass.value,
            repass:this.repass.value, email:email},function(data){
                console.log(data);
                if (data.err!=""){
                    that.setState({err:data.err})
                } else {
                    that.setState({message:"Đổi mật khẩu thành công!"})
                }
        })
        e.preventDefault();
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
        if (this.state.permission == 0) {
            return (<div className="text-center">
                <br />
                <h3>Để thực hiện chức năng này bạn phải đăng nhập!</h3>
                <button className="btn btn-primary" onClick={this.goLogin} style={{ marginTop: '10px' }}>Đi đến trang đăng nhập</button>
            </div>)
        } else {
            return (<section class="main-content-section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="bstore-breadcrumb">
                                <a href="/">Trang chủ<i class="fa fa-angle-double-right"></i></a>
                                <a href="/manageaccount">Quản lý tài khoản<i class="fa fa-angle-double-right"></i></a>
                                <span>ĐỔI MẬT KHẨU</span>

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h2 class="page-title text-center">ĐỔI MẬT KHẨU</h2>
                        </div>
                        <h3 className="text-center" style={{ color: 'red' }}>{this.state.err}</h3>
                        <h3 className="text-center" style={{ color: 'blue' }}>{this.state.message}</h3>
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 col-lg-push-4 col-md-push-3 col-sm-push-3">
                            <form onSubmit={this.handleSubmit}>
                                <div class="account-info">
                                    <div class="single-account-info">
                                        <div class="form-group">
                                            <label class="control-label" for="old-password">Mật khẩu cũ</label>
                                            <div class="input-wrap">
                                                <input type="password" name="old-password" class="form-control" id="old_password" ref={(data) => { this.oldpass = data; }} />
                                                <span class="help-block"></span>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label" for="new-password">Mật khẩu mới</label>
                                            <div class="input-wrap">
                                                <input type="password" class="form-control" name="new-password" id="new_password" ref={(data) => { this.newpass = data; }} />
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label" for="re-password">Nhập lại mật khẩu mới</label>
                                            <div class="input-wrap">
                                                <input type="password" class="form-control" name="re-password" id="re_password" ref={(data) => { this.repass = data; }} />
                                            </div>
                                        </div>
                                        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 text-center">
                                            <input type="submit" class="btn btn-success text-center" value="Lưu" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="home-link-menu">
                                <ul>
                                    <li><a href="/"><i class="fa fa-chevron-left"></i> Trang chủ</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>)
        }
    }
}

ReactDOM.render(
    <Provider store={store}>
        <HeaderTop/>
        <HeaderMiddle/>
        <MainMenu/>
        <PasswordForm/>
        <CompanyFacality/>
        <Footer/>
        <CopyRight/>
    </Provider>, document.getElementById("changepassword")
)