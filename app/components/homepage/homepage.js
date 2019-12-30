import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import HeaderBottom from '../homepage/header-bottom'
import MainContentSection1 from '../homepage/main-content-section1'
import MainContentSection2 from '../homepage/main-content-section2'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import ReactGA from 'react-ga'
var {Provider} = require("react-redux");
var store = require("../../store");

function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
class HomePage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        initizeAnalytics();
        $.post("/addNewDay",function(data){     
        })
        return(
            <div>
                <HeaderTop/>
                <HeaderMiddle/>
                <MainMenu/>
                <HeaderBottom/>
                <MainContentSection1/>
                <MainContentSection2/>
                <CompanyFacality/>
                <Footer/>
                <CopyRight/>
            </div>
        )
    }
}
ReactDOM.render(
    <Provider store={store}>
        <HomePage/>
    </Provider>, document.getElementById('homepage')
)