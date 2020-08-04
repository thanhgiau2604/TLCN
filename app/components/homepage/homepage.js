import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from '../common/header-top'
import HeaderMiddle from '../common/header-middle'
import MainMenu from '../common/main-menu'
import HeaderBottom from '../homepage/header-bottom'
import MainContentSection1 from '../homepage/main-content-section11'
import MainContentSection2 from '../homepage/main-content-section2'
import CompanyFacality from '../common/company-facality'
import Footer from '../common/footer'
import CopyRight from '../common/copyright'
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
var {Provider} = require("react-redux");
var store = require("../../store");
import ReactGA from 'react-ga'
function initizeAnalytics(){
    ReactGA.initialize("UA-155099372-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}
// class FormRequireUpdateInfor extends React.Component {
//     constructor(props){
//         super(props);
//     }
//     render(){
//         return (
//           <div
//             className="modal fade right "
//             id="modalUpdateInfor"
//             role="dialog"
//             aria-labelledby="myModalLabel"
//             aria-hidden="true">
//             <div
//               className="modal-dialog modal-full-height modal-right modal-lg"
//               role="document">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h4
//                     className="modal-title w-100 text-center"
//                     id="myModalLabel">
//                     CẬP NHẬT THÔNG TIN
//                   </h4>
//                   <button
//                     type="button"
//                     className="close"
//                     data-dismiss="modal"
//                     aria-label="Close">
//                     <span aria-hidden="true">&times;</span>
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="row">
//                     <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                       <div class="group">
//                         <input type="text" name="email" required ref="email"/>
//                         <span class="highlight"></span>
//                         <span class="bar"></span>
//                         <label class="labelMaterialButton">Nhập Email</label>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                       <div class="group">
//                         <input type="text" name="phone" required ref="phone"/>
//                         <span class="highlight"></span>
//                         <span class="bar"></span>
//                         <label class="labelMaterialButton">Nhập Số điện thoại</label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer justify-content-center">
//                   <button
//                     type="button" className="btn btn-danger" onClick={this.submitForm}>
//                     Cập nhật
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//     }
// }
class HomePage extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        $.get("/checkSale",function(data){  
        })

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