import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import LoginForm from '../login/login-form'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
class Login extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        localStorage.clear();
        return(
			<div>
                <HeaderTop/>
                <HeaderMiddle/>
                <MainMenu/>
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
