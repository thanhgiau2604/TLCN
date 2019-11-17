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

var main;
class DetailMessage extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(<div className="row">
        <h3 className="text-center"><b>Thời gian: </b><span>{this.props.datetime}</span></h3>
        <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-md-push-2">
            <div className="form-group">
                <label for="comment">Nội dung tin nhắn:</label>
                <textarea className="form-control text-center" rows="5" id="comment" value={this.props.content}
                style={{border: 'solid 2px blue'}} readOnly></textarea>
            </div>
        </div>
    </div>)
    }
}

class RowMessage extends React.Component{
    constructor(props){
        super(props);
        this.handleDetail = this.handleDetail.bind(this);
    }
    handleDetail(){
        main.setState({detail:true,curdatetime:this.props.datetime,curcontent:this.props.content});
    }
    render(){
        return(<tr>
            <td>{this.props.content}</td>
            <td>{this.props.datetime}</td>
            <td>						
                <a className='btn btn-danger' data-toggle='tooltip' title='Chi tiết' onClick={this.handleDetail}>
                    <i className='fa fa-search'></i>
                </a>
            </td>
        </tr>)
    }
}
class MessageForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listMessage:[],
            detail:false,
            curdatetime:"",
            curcontent:""
        }
        main = this;
    }
    componentDidMount(){
        var that=this;
        $.get("/getMessage",function(data){
            that.setState({listMessage:data});
        })
    }
    render(){
        var componentDetail="";
        if (this.state.detail==true){
            componentDetail=<DetailMessage datetime={this.state.curdatetime} content={this.state.curcontent}/>;
        }
        return(<section className="main-content-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="bstore-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span><i className="fa fa-caret-right	"></i></span>
                        <span>Tin nhắn</span>
                    </div>        
                </div>
            </div>
            {componentDetail}
            <div className="row">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Tin nhắn</th>
                            <th>Ngày</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.listMessage.map(function(row,index){
                            return <RowMessage key={index} content={row.content} datetime={row.datetime}
                            id={index}/>;
                        })}        
                    </tbody>
                </table>
            </div>
        </div>
    </section>)
    }
}
ReactDOM.render(
    <Provider store={store}>
		<HeaderTop />
		<HeaderMiddle />
		<MainMenu />
		<MessageForm/>
		<CompanyFacality />
		<Footer />
		<CopyRight />
	</Provider>,document.getElementById("personal-message")
)