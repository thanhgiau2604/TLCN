import React from 'react'
class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleSignOut = this.handleSignOut.bind(this);
    }
    componentDidMount(){
    }
    handleSignOut(){
        localStorage.removeItem('usernamead');
        localStorage.removeItem('emailad');
        localStorage.removeItem('tokenad');
        window.location.assign("/login");
    }
    render(){
        return (<nav class="navbar navbar-inverse navbar-static-top example6">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar6">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand text-hide" href="/dashboard">Brand Text
        </a>
      </div>
      <div id="navbar6" class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a href="/manageMessage"><i class='icon-envelope'> Messages</i></a></li>
          <li><a href="/manageChat"><i class='icon-comments-alt'> Manage Chat</i></a></li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class='icon-user'> {localStorage.getItem('usernamead')}</i> <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li><a onClick={this.handleSignOut} style={{cursor:'pointer'}}>Log out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>)       
    }
}
export default Navbar;