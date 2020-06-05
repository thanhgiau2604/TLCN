import React from 'react'
import io from 'socket.io-client'
import {Launcher} from 'react-chat-window'
const socket = io('http://localhost:3000');
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
class UserChat extends React.Component {
    constructor() {
      super();
      this.state = {
        messageList: [],
        isRegister: false,
        notify:false,
        newMessagesCount: 0,
        isOpen: false
      };
    }
    componentDidMount(){
        var that = this;
        socket.emit("share-email-to-server",localStorage.getItem("email"));
        socket.on("server-send-message", function (data) {
            if (data.data.author == "me") {
                $.post("/saveMessage", { sender:localStorage.getItem("email"), receiver:"admin", content1: data.data.data.text, content2:data.data.data.emoji,
            type: data.data.type}, function (data) {
                })
            } else {
              NotificationManager.warning('Thông báo', 'Có tin nhắn mới', 3000);   
          }
          const newMessagesCount = that.state.isOpen ? that.state.newMessagesCount : that.state.newMessagesCount + 1;
          that.setState({ messageList: [...that.state.messageList, data.data],newMessagesCount: newMessagesCount});
        });
        socket.emit("require-id-admin","nothing");
        socket.emit("share-id-mine",localStorage.getItem("email"));
        $.post("/getMessage",{email:localStorage.getItem('email')},function(data){
          var arrMessage = []
          for(var i=0; i<data.length; i++){
              var singleMessage = {
                  author: "me",
                  type: data[i].type
              }
              if (data[i].type=="text") singleMessage.data = {text:data[i].content}; else
              singleMessage.data = {emoji: data[i].content}
              if (data[i].sender=="admin"){
                  singleMessage.author='them'
              }
              arrMessage.push(singleMessage);
          }
          that.setState({messageList:arrMessage});
      })
    }
    _onMessageWasSent(message) {
        var singleMessage = {
            message:message,
            email: localStorage.getItem("email")
        }
        console.log(message);
        socket.emit("user-send-message",singleMessage);
    }
    _handleClick() {
      this.setState({
        isOpen: !this.state.isOpen,
        newMessagesCount: 0
      });
    }
    render() {
      return (<div class="userchat">
        <NotificationContainer />
        <Launcher
          agentProfile={{
            teamName: 'admin',
            imageUrl: '/img/ic-chat-ad.png'
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
  export default UserChat;