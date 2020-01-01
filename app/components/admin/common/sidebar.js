import React from 'react'

class Sidebar extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var value = this.props.active;
        console.log(value);
        var str = "launcher";
        var classValue1 = str, classValue2 =str, classValue3 = str, classValue4 = str, classValue5=str;
        if (value==1){
          classValue1 = "active "+str;
        } else if (value==2){
          classValue2 = "active "+str;
        } else if (value==3){
          classValue3 = "active "+str;
        } else if (value==4){
          classValue4 = "active "+str;
        } else if (value==5){
          classValue5 = "active "+str;
        }
        return(<section id='sidebar'>
        <i class='icon-align-justify icon-large' id='toggle'></i>
        <ul id='dock'>
          <li class={classValue1}>
            <i class='icon-dashboard'></i>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li class={classValue2}>
            <i class='icon-user'></i>
            <a href="/manageuser">Users</a>
          </li>
          <li class={classValue3}>
            <i class='icon-list-ul'></i>
            <a href='/manageCategory'>Categories</a>
          </li>
          <li class={classValue4}>
            <i class='icon-archive'></i>
            <a href='/manageproduct'>Products</a>
          </li>
          <li class={classValue5}>
            <i class='icon-th-list'></i>
            <a href='/manageorder'>Order</a>
          </li>
        </ul>
      </section>)
    }
}
export default Sidebar;