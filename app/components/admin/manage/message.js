import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
var main
class Message extends React.Component {
  constructor(props){
    super(props);
    this.deleteMessage = this.deleteMessage.bind(this);
  }
  deleteMessage(){
    var that = this;
    $.post("/deleteMessage",{id:that.props.id},function(data){
      main.setState({listMessage:data});
    })
  }
  render(){
    return(<tr class='active'>
    <td>{this.props.stt}</td>
    <td>{this.props.content}</td>
    <td>{this.props.time}</td>
    <td class='action'>
      <a class='btn btn-danger' data-toggle='tooltip' style={{cursor:'pointer'}} title='Delete' onClick={this.deleteMessage}>
        <i class='icon-trash'></i>
      </a>
    </td>
  </tr>)
  }
}
class AddForm extends React.Component {
  constructor(props){
    super(props);
    this.AddMessage = this.AddMessage.bind(this);
    this.Cancel = this.Cancel.bind(this);
  }
  AddMessage(e){
    e.preventDefault();
    const content = this.content.value;
    $.post("/addMessage",{content:content,email:localStorage.getItem("emailad")},function(data){
      main.setState({add:false,listMessage:data});
    });
  }
  Cancel(){
    main.setState({add:false})
  }
  render(){
    return(<div class="container">
    <div class="row">
      <form onSubmit={this.AddMessage}>
        <div class="col-sm-12">
          <div class="row">
              <label>Nội dung tin nhắn</label>
                <textarea class="form-control"  ref={(data) => { this.content = data; }} rows='5' cols="auto" required></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-danger">Save</button>
            <button type="button" class="btn btn-default" onClick={this.Cancel}
            style={{marginLeft:'10px'}}>Cancel</button>
          </div>  
        </div>
      </form>
    </div>
  </div>)
  }
}
class ManageMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          listMessage: [],
          add:false,
          curpage: 1
        }
        main = this;
        this.handleAddMessage = this.handleAddMessage.bind(this);
    }
    componentWillMount(){
      var token = localStorage.getItem('tokenad');
      if (!token){
        window.location.assign('/login');
      } else {
        $.get("/admin",{token:token},function(data){
          if (data.success==0){
            localStorage.removeItem('emailad');
            localStorage.removeItem('usernamead');
            window.location.assign("/login");
          }
        })
      }
    }
    componentDidMount(){
      var that = this;
      $.get("/getListMessage",function(data){
        that.setState({listMessage:data});
      })
    }
    changePage(value,event){
      this.setState({curpage:value});
    }
    handleAddMessage(){
      this.setState({add:true});
    }
    render(){
      var Add;
      if (this.state.add == true) { Add = <AddForm /> } else { Add = "" }
      var lCurMessage = [];
      var page = "";
      if (this.state.listMessage.length != 0) {
        page=[];
        var perpage = 3;
        var start = (this.state.curpage - 1) * perpage;
        lCurMessage = this.state.listMessage.slice(start, start + perpage);    
        var numberpage = Math.ceil(this.state.listMessage.length / perpage);
        for (var i=1; i<=numberpage; i++){
          if (this.state.curpage==i){
            page.push(<li class='active'><a onClick={this.changePage.bind(this,i)} >{i}</a></li>);
          } else {
            page.push(<li><a onClick={this.changePage.bind(this,i)}>{i}</a></li>)
          }
        }
      }      
        return(<div id='content'>
        <div class='panel panel-default grid'>
          <div class='panel-heading'>
            <i class='icon-table icon-large'></i>
            Message
            <div class='panel-tools'>
              <div class='btn-group'>
              </div>
            </div>
          </div>
          <div class='panel-body filters'>
            <div class="row">
              <h3 class="text-center"><b>LIST MESSAGES</b></h3>
            </div>
            <div class='row'>
              <div class='col-md-9'> 
              </div>
              <div class='col-md-3'>
                <div class='input-group'>
                  <span class='input-group-btn'>
                  </span>
                </div>
              </div>
              <div class="text-right" style={{ marginTop: '50px', paddingRight: '10%' }}>
              <button class="btn btn-warning" onClick={this.handleAddMessage}>
                <i class="icon-plus-sign"></i>Add Message
               </button>
            </div>
            </div>
          </div>
          {Add}
          <table class='table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Content</th>
                <th>Time</th>
                <th class='actions'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>         
              {lCurMessage.map(function(mess,index){
                return <Message key={index} id={mess._id} content={mess.content} stt={start+(index+1)}
                time={mess.datetime}/>
              })}
            </tbody>
          </table>
          <div class='panel-footer'>
            <ul class='pagination pagination-sm'>
              <li>
                <a href='#'>«</a>
              </li>
              {page}
              <li>
                <a href='#'>»</a>
              </li>
            </ul>
            <div class='pull-right'>
            </div>
          </div>
        </div>
      </div>)
    }
}
ReactDOM.render(
    <div>
        <Navbar/>
        <div id="wrapper">
            <Sidebar/>
            <Tool/>
            <ManageMessage/>
        </div>
    </div>,document.getElementById("managemessage"))