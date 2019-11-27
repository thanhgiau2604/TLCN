import React from 'react'
import $ from 'jquery'
class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleSignOut = this.handleSignOut.bind(this);
    }
    componentDidMount(){
        var token = localStorage.getItem('tokenad');
        if (!token)
        {
            window.location.assign('/login');
        }
    }
    handleSignOut(){
        localStorage.removeItem('usernamead');
        localStorage.removeItem('emailad');
        localStorage.removeItem('tokenad');
        window.location.assign("/login");
    }
    render(){
        return (<div class='navbar navbar-default' id='navbar'>
            <a class='navbar-brand' href='#'>
                <img src="/assets/images/logo2.png" />
            </a>
            <ul class='nav navbar-nav pull-right'>
                <li class='dropdown'>
                    <a class='dropdown-toggle' data-toggle='dropdown' href='#'>
                        <i class='icon-envelope'></i>
                        Messages
              <span class='badge'>5</span>
                        <b class='caret'></b>
                    </a>
                    <ul class='dropdown-menu'>
                        <li>
                            <a href='#'>New message</a>
                        </li>
                        <li>
                            <a href='#'>Inbox</a>
                        </li>
                        <li>
                            <a href='#'>Out box</a>
                        </li>
                        <li>
                            <a href='#'>Trash</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href='#'>
                        <i class='icon-cog'></i>
                        Settings
            </a>
                </li>
                <li class='dropdown user'>
                    <a class='dropdown-toggle' data-toggle='dropdown' href='#'>
                        <i class='icon-user'></i>
                        <strong>{localStorage.getItem('usernamead')}</strong>
                        <img class="img-rounded" src="http://placehold.it/20x20/ccc/777" />
                        <b class='caret'></b>
                    </a>
                    <ul class='dropdown-menu'>
                        <li>
                            <a href='#'>Edit Profile</a>
                        </li>
                        <li class='divider'></li>
                        <li>
                            <a onClick={this.handleSignOut} style={{cursor:'pointer'}}>Sign out</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>)
    }
}
export default Navbar;