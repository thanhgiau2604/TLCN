import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import { Launcher } from 'react-chat-window'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Navbar from '../common/navbar'
import $ from 'jquery'
const socket = io('http://localhost:3000');
var main,chatAd;
class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      nameChat: 'user',
      newMessagesCount: 0,
      isOpen: false
    };
    chatAd = this;
  }
  componentDidMount() {
    var that = this;
    socket.emit("require-public", "nothing");
    socket.on("send-listuser",function(data){
      if (data.data.data.author== "me"){
        main.setState({listUser:data.listUser});
      } else {
        var arrUser = data.listUser;
        var index = arrUser.findIndex(item => item.email === data.data.email);
        if (data.email == that.state.nameChat){
          that.state.isOpen ? arrUser[index].seen = true : arrUser[index].seen = false;
        } else  {
          arrUser[index].seen=false;
        }
        socket.emit("change-listuser",arrUser);
        main.setState({listUser:arrUser});
      }
    })
    socket.on("server-send-message", function (data) {
      if (data.data.author == "me") {
        $.post("/saveMessage", { sender:"admin", receiver:data.email, content1: data.data.data.text, content2:data.data.data.emoji,
      type: data.data.type}, function (data) {
        })
      } else {
        NotificationManager.warning('Thông báo', 'Có tin nhắn mới', 3000);
      }
      if (data.email==that.state.nameChat){
        const newMessagesCount = that.state.isOpen ? that.state.newMessagesCount : that.state.newMessagesCount + 1;
        that.setState({ messageList: [...that.state.messageList, data.data],newMessagesCount: newMessagesCount});
      }
    });
    socket.on("share-new-id-user",function(data){
       if (chatAd.state.nameChat==data.email){
          localStorage.setItem("curidUser",data.id);
       }
    })
    
  }
  _onMessageWasSent(message) {
    var singleMessage = {
      email: this.state.nameChat,
      message:message,
      idUser: localStorage.getItem("curidUser")
    }
    socket.emit("user-send-message", singleMessage);
  }
  _handleClick() {
    var arrUser = main.state.listUser;
    var index = arrUser.findIndex(item => item.email === this.state.nameChat);
    arrUser[index].seen = true;
    main.setState({ listUser: arrUser });
    socket.emit("change-listuser",arrUser);
    $.post("/updateSeenStatus", { email: this.state.nameChat }, function (data) {
    })
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    });
  }
  render() {
    return (<div>
      <Launcher
        agentProfile={{
          teamName: this.state.nameChat,
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
        newMessagesCount={this.state.newMessagesCount}
        isOpen={this.state.isOpen}
        handleClick={this._handleClick.bind(this)}
      />
    </div>)
  }
}
class SingleUser extends React.Component {
  constructor(props){
    super(props);
    this.chatwithUser = this.chatwithUser.bind(this);
  }
  chatwithUser(user) {
    var pos = this.props.pos;
    var arrUser= main.state.listUser;
    arrUser[pos].seen = true;
    chatAd.setState({ nameChat: user.email,isOpen:true});
    localStorage.setItem("curidUser", user.id);
    main.setState({listUser:arrUser});
    socket.emit("change-listuser",arrUser);
    $.post("/getMessage", { email: user.email }, function (data) {
      var arrMessage = [];
      for (var i = 0; i < data.length; i++) {
        var singleMessage = {
          author: "them",
          type: data[i].type
        }
        if (data[i].type=="text") singleMessage.data = {text:data[i].content}; else
                    singleMessage.data = {emoji: data[i].content}
        if (data[i].sender == "admin") {
          singleMessage.author = 'me'
        }
        arrMessage.push(singleMessage);
      }
      chatAd.setState({ messageList: arrMessage });
    });
    $.post("/updateSeenStatus",{email: user.email},function(data){
    })
  }
  render(){
    var classSeen="";
    this.props.user.seen ? classSeen="" : classSeen="notseen";
    console.log(this.props.user);
    return(<div class={"chat_list "+classSeen} onClick={() => this.chatwithUser(this.props.user)}
    style={{cursor:"pointer"}}>
    <div class="chat_people">
      <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
      <div class="chat_ib">
        <h5>{this.props.user.email}<span class="chat_date">{this.props.user.day}</span></h5>
        <p>{this.props.user.lastmessage}</p>
      </div>
    </div>
  </div>)
  }
}
class AdminChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUser: []
    }
    main = this;
  }
  componentDidMount(){
    var that = this;
    $.get("/getListUser",function(data){
      that.setState({listUser:data});
    })
  }
  render() {
    var that = this;
    return (<div>
      <div class="container">
        <h3 class=" text-center">Messaging</h3>
        <div class="messaging">
          <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                <div class="recent_heading">
                  <h4>Recent</h4>
                </div>
                <div class="srch_bar">
                  <div class="stylish-input-group">
                    <input type="text" class="search-bar" placeholder="Search" />
                  </div>
                </div>
              </div>
              <div class="inbox_chat">
                {this.state.listUser.map(function (user, index) {
                  return (<SingleUser key={index} pos={index} user={user}/>)
                })}
              </div>
            </div>
          </div>
        </div></div>)
      })}
      <Demo />
      <NotificationContainer />
    </div>)
  }
}
ReactDOM.render(
<div>
  <Navbar/>
  <div id="wrapper">
    <AdminChat />
  </div>
</div>, document.getElementById("managechat"));