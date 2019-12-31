import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import ForgotPasswordForm from '../forgotpassword/forgotpassword-form'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import $ from 'jquery'
class ForgotPassword extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        $.post("/addNewDay",function(data){
            
        })
        localStorage.clear();
        return(
			<div>
                <HeaderTop/>
                <HeaderMiddle/>
                <ForgotPasswordForm/>
                <CompanyFacality/>
                <Footer/>
                <CopyRight/>
            </div>)
    }
}
ReactDOM.render(
    <ForgotPassword/>, document.getElementById("forgotpassword")
)
