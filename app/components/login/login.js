import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import LoginForm from '../login/login-form'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import $ from 'jquery'
class Login extends React.Component{
    constructor(props){
        super(props);
    }
    componentWillMount(){
        var token = localStorage.getItem("token");
        var tokenad = localStorage.getItem("tokenad");
        if (token){
            $.get("/api", { token: token }, function (data) {
                if (data.success == 1) {
                    window.location.replace("/");
                } 
            })
        }
        if (tokenad){
            $.get("/admin",{token:tokenad},function(data){
                if (data.success==1){
                    window.location.replace("/dashboard");
                }
            })
        }
    }
    render(){
        $.post("/addNewDay",function(data){
            console.log(data);
        })
        return(
			<div>
                <HeaderTop/>
                <HeaderMiddle/>
                <LoginForm/>
                <CompanyFacality/>
                <Footer/>
                <CopyRight/>
            </div>)
    }
}
ReactDOM.render(
    <Login/>, document.getElementById("login")
)
