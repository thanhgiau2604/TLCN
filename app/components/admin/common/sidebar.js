import React from 'react'

class Sidebar extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<section id='sidebar'>
        <i class='icon-align-justify icon-large' id='toggle'></i>
        <ul id='dock'>
          <li class='active launcher'>
            <i class='icon-dashboard'></i>
            <a href="dashboard.html">Dashboard</a>
          </li>
          <li class='launcher'>
            <i class='icon-user'></i>
            <a href="tables.html">Users</a>
          </li>
          <li class='launcher'>
            <i class='icon-list-ul'></i>
            <a href='#'>Categorys</a>
          </li>
          <li class='launcher'>
            <i class='icon-archive'></i>
            <a href='#'>Products</a>
          </li>
          <li class='launcher'>
            <i class='icon-bar-chart'></i>
            <a href='#'>Analytic</a>
          </li>
          <li class='launcher dropdown hover'>
            <i class='icon-flag'></i>
            <a href='#'>Reports</a>
            <ul class='dropdown-menu'>
              <li class='dropdown-header'>Launcher description</li>
              <li>
                <a href='#'>Action</a>
              </li>
              <li>
                <a href='#'>Another action</a>
              </li>
              <li>
                <a href='#'>Something else here</a>
              </li>
            </ul>
          </li>
          <li class='launcher'>
            <i class='icon-file-text-alt'></i>
            <a href="forms.html">Forms</a>
          </li>
        </ul>
        <div data-toggle='tooltip' id='beaker' title='Made by lab2023'></div>
      </section>)
    }
}
export default Sidebar;