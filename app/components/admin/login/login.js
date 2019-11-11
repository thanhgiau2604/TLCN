import React from 'react'
import ReactDOM from 'react-dom'
class LoginAdmin extends React.Component{
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            err:""
        }
    }
    handleLogin(){
        console.log(this.emailphone.value);
        console.log(this.psw.value);
        var that = this;
        $.post("loginadmin",{emailphone:that.emailphone.value,psw:that.psw.value},function(data){
            console.log(data);
            if (data.err==1){
                that.setState({err:data.message})
            } else {
                localStorage.setItem("usernamead",data.username);
                localStorage.setItem("emailad",data.email)
                window.location.assign("/dashboard");
            }
        })
    }
    render(){
        return (<form>
            <div class="input-section email-section">
                <input class="email" type="email" name="emailphone" placeholder="ENTER YOUR E-MAIL OR PHONE HERE" autocomplete="off" ref={(data) => { this.emailphone = data; }}/>
                <div class="animated-button"><span class="icon-paper-plane"><i class="fa fa-envelope-o"></i></span><span class="next-button email"><i class="fa fa-arrow-up"></i></span></div>
            </div>
            <div class="input-section repeat-password-section folded">
                <input class="repeat-password" name="psw" type="password" placeholder="INPUT YOUR PASSWORD HERE" ref={(data) => { this.psw = data; }}/>
                <div class="animated-button"><span class="icon-repeat-lock"><i class="fa fa-lock"></i></span><span class="next-button repeat-password"><i class="fa fa-paper-plane" onClick={this.handleLogin}></i></span></div>
            </div>
            <div class="success">
                <p>{this.state.err}</p>
            </div>
            {/* <h3 className="text-center" style={{ paddingTop:'80px',textAlign:'center'}}>{this.state.err}</h3> */}
        </form>)
    }
}
ReactDOM.render(<LoginAdmin/>,document.getElementById("login-admin"));
