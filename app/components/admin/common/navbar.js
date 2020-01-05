import React from 'react'
class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.goMessage = this.goMessage.bind(this);
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
    goMessage(){
        window.location.assign("/manageMessage");
    }
    render(){
        return (<div class='navbar navbar-default' id='navbar'>
            <a class='navbar-brand' href='/dashboard'>
                <img src="/assets/images/logo-admin1.png" />
            </a>
            <ul class='nav navbar-nav pull-right'>
                <li class='dropdown'>
                    <a style={{cursor:'pointer'}} onClick={this.goMessage}>
                        <i class='icon-envelope'></i>
                        Messages
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