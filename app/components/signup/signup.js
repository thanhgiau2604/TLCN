import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import SignUpForm from '../signup/signup-form'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
class SignUp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
			<div>
                <HeaderTop/>
                <HeaderMiddle/>
                <SignUpForm/>
                <CompanyFacality/>
                <Footer/>
                <CopyRight/>
            </div>)
    }
}
ReactDOM.render(
    <SignUp/>, document.getElementById("signup")
)
