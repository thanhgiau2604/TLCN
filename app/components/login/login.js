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
    render(){
        $.post("/addNewDay",function(data){
            console.log(data);
        })
        localStorage.clear();
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
