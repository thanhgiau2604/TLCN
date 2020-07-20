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
            permission: 0,
            processing: false
        }
        this.goLogin = this.goLogin.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        this.setState({processing:true});
        var that=this;
        var email= localStorage.getItem('email');
        $.post("/changepassword",{oldpass:this.oldpass.value,newpass:this.newpass.value,
            repass:this.repass.value, email:email},function(data){
                if (data.err!=""){
                    that.setState({err:data.err})
                } else {
                    that.setState({message:"Đổi mật khẩu thành công!"});
                }
                that.setState({processing:false});
        })
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
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 col-lg-push-4 col-md-push-3 col-sm-push-3">
                            <form>
                                <div class="account-info">
                                    <div class="single-account-info">
                                        <div class="group">
                                            <input type="password" name="old-password" required ref={(data) => { this.oldpass = data; }} />
                                            <span class="highlight"></span>
                                            <span class="bar"></span>
                                            <label class="labelMaterialButton">Mật khẩu cũ</label>
                                        </div>

                                        <div class="group">
                                            <input type="password" name="new-password" required ref={(data) => { this.newpass = data; }} />
                                            <span class="highlight"></span>
                                            <span class="bar"></span>
                                            <label class="labelMaterialButton">Mật khẩu mới</label>
                                        </div>

                                        <div class="group">
                                            <input type="password" name="re-password" required ref={(data) => { this.repass = data; }} />
                                            <span class="highlight"></span>
                                            <span class="bar"></span>
                                            <label class="labelMaterialButton">Nhập lại mật khẩu mới</label>
                                        </div>
                                        {this.state.processing==true ? <div class="loader text-center"></div> : ""}
                                        <did class="row">
                                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                                                <button class="btn btn-success text-center submitPass" onClick={this.handleSubmit}>
                                                    <i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                                {/* <input type="submit" class="btn btn-success text-center submitPass" value="Lưu" /> */}
                                            </div>
                                        </did>
                                        <div>
                                            <h3 className="text-center" style={{ color: 'red' }}>{this.state.err}</h3>
                                            <h3 className="text-center" style={{ color: 'blue' }}>{this.state.message}</h3>
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