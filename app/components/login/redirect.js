import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
class RedirectPage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        $.get("/success",function(data){
            localStorage.setItem('username',data.username);
            localStorage.setItem('email',data.email);
            localStorage.setItem('token',data.token);
            window.location.assign("/");
        })
        return(
            <div>
                <h2 className="text-center">Please wait....</h2>
            </div>
        )
    }
}
ReactDOM.render(
    <RedirectPage/>, document.getElementById('redirect')
)