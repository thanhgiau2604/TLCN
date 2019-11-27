import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
var main,user;
class Users extends React.Component {
  constructor(props){
    super(props);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  editUser(){
    user = this;
    main.setState({edit:true, add:false});
  }
  deleteUser(){
    var that = this;
    $.post("/deleteUser",{id:that.props.id},function(data){
      main.setState({listUsers:data});
    })
  }
  render(){
    var sdt = this.props.phone;
    var dob = this.props.dob;
    if (!sdt) sdt="N/A";
    if (!dob) dob="N/A";
    return(<tr class='active'>
    <td>{this.props.stt}</td>
    <td>{this.props.firstname}</td>
    <td>{this.props.lastname}</td>
    <td>{this.props.email}</td>
    <td>{sdt}</td>
    <td>{dob}</td>
    <td class='action'>
      <a class='btn btn-info' data-toggle='tooltip' style={{cursor:'pointer'}} title='Edit' onClick={this.editUser}>
        <i class='icon-edit'></i>
      </a>
      <a class='btn btn-danger' data-toggle='tooltip' style={{cursor:'pointer'}} title='Delete' onClick={this.deleteUser}>
        <i class='icon-trash'></i>
      </a>
    </td>
  </tr> )
  }
}
class EditForm extends React.Component{
  constructor(props){
    super(props);
    this.UpdateInfor = this.UpdateInfor.bind(this);
    this.Cancel = this.Cancel.bind(this);
  }
  UpdateInfor(e){
    const id = user.props.id;
    const firstname = this.firstName.value;
    const lastname = this.lastName.value;
    const email = this.email.value;
    const phone = this.phone.value;
    const dob = this.dob.value;
    $.post("/updateUser",{id:id,firstname:firstname, lastname:lastname, email:email, 
      phone:phone, dob:dob},function(data){
      main.setState({edit:false,listUsers:data});
    });
    e.preventDefault();
  }
  Cancel(){
    main.setState({edit:false})
  }
  render(){
    return (<div class="container">
      <div class="row">
        <form onSubmit={this.UpdateInfor}>
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-4 form-group">
                <label>First Name</label>
                <input type="text" placeholder="Enter Firstname" class="form-control" defaultValue={user.props.firstname} ref={(data) => { this.firstName = data; }}/>
              </div>
              <div class="col-sm-4 form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Enter Firstname" class="form-control" defaultValue={user.props.lastname} ref={(data) => { this.lastName = data; }}/>
              </div>
              <div class="col-sm-4 form-group">
                <label>Email</label>
                <input type="text" placeholder="Enter Email" class="form-control" defaultValue={user.props.email} ref={(data) => { this.email = data; }}/>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 form-group col-sm-push-2">
                <label>Phone Number</label>
                <input type="text" placeholder="Enter Phone Number" class="form-control" defaultValue={user.props.phone} ref={(data) => { this.phone = data; }}/>
              </div>
              <div class="col-sm-4 form-group col-sm-push-2">
                <label>Date of Birth</label>
                <input type="text" placeholder="Enter Date Of Birth" class="form-control" defaultValue={user.props.dob} ref={(data) => { this.dob = data; }}/>
              </div>
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

class AddForm extends React.Component {
  constructor(props){
    super(props);
    this.AddUser = this.AddUser.bind(this);
    this.Cancel = this.Cancel.bind(this);
  }
  AddUser(e){
    e.preventDefault();
    const firstname = this.firstName.value;
    const lastname = this.lastName.value;
    const email = this.email.value;
    const phone = this.phone.value;
    const dob = this.dob.value;
    $.post("/addUser",{firstname:firstname, lastname:lastname, email:email, 
      phone:phone, dob:dob},function(data){
      main.setState({add:false,listUsers:data});
    });
  }
  Cancel(){
    main.setState({add:false})
  }
  render(){
    return(<div class="container">
    <div class="row">
      <form onSubmit={this.AddUser}>
        <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-4 form-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter Firstname" class="form-control"  ref={(data) => { this.firstName = data; }}/>
            </div>
            <div class="col-sm-4 form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter Firstname" class="form-control" ref={(data) => { this.lastName = data; }}/>
            </div>
            <div class="col-sm-4 form-group">
              <label>Email</label>
              <input type="text" placeholder="Enter Email" class="form-control" ref={(data) => { this.email = data; }}/>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4 form-group col-sm-push-2">
              <label>Phone Number</label>
              <input type="text" placeholder="Enter Phone Number" class="form-control" ref={(data) => { this.phone = data; }}/>
            </div>
            <div class="col-sm-4 form-group col-sm-push-2">
              <label>Date of Birth</label>
              <input type="text" placeholder="Enter Date Of Birth" class="form-control" ref={(data) => { this.dob = data; }}/>
            </div>
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
class ManageUsers extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          listUsers: [],
          edit:false,
          add:false,
          curpage: 1
        }
        main = this;
        this.handleAddUser = this.handleAddUser.bind(this);
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
      $.get("/getListUsers",function(data){
        that.setState({listUsers:data});
      })
    }
    changePage(value,event){
      this.setState({curpage:value});
    }
    handleAddUser(){
      this.setState({add:true, edit:false});
    }
    render(){
      var Edit,Add;
      if (this.state.edit == true) { Edit = <EditForm /> } else { Edit = "" }
      if (this.state.add == true) { Add = <AddForm /> } else { Add = "" }
      var lCurUser = [];
      var page = "";
      if (this.state.listUsers.length != 0) {
        page=[];
        var perpage = 3;
        var start = (this.state.curpage - 1) * perpage;
        lCurUser = this.state.listUsers.slice(start, start + perpage);    
        var numberpage = Math.ceil(this.state.listUsers.length / perpage);
        for (var i=1; i<=numberpage; i++){
          if (this.state.curpage==i){
            page.push(<li class='active'><a onClick={this.changePage.bind(this,i)} >{i}</a></li>);
          } else {
            page.push(<li><a onClick={this.changePage.bind(this,i)}>{i}</a></li>)
          }
        }
        console.log(page);
      }      
        return(<div id='content'>
        <div class='panel panel-default grid'>
          <div class='panel-heading'>
            <i class='icon-table icon-large'></i>
            Manage Users
            <div class='panel-tools'>
              <div class='btn-group'>
              </div>
              {/* <div class='badge'>3 record</div> */}
            </div>
          </div>
          <div class='panel-body filters'>
            <div class="row">
              <h3 class="text-center"><b>LIST USER ACCOUNTS</b></h3>
            </div>
            <div class='row'>
              <div class='col-md-9'> 
              </div>
              <div class='col-md-3'>
                <div class='input-group'>
                  <input class='form-control' placeholder='Quick search...' type='text'/>
                  <span class='input-group-btn'>
                    <button class='btn' type='button'>
                      <i class='icon-search'></i>
                    </button>
                  </span>
                </div>
              </div>
              <div class="text-right" style={{ marginTop: '50px', paddingRight: '10%' }}>
              <button class="btn btn-warning" onClick={this.handleAddUser}>
                <i class="icon-plus-sign"></i>Add New User
                </button>
            </div>
            </div>
          </div>
          {Edit}
          {Add}
          <table class='table'>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date Of Birth</th>
                <th class='actions'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>         
              {lCurUser.map(function(user,index){
                return <Users key={index} id={user._id} firstname = {user.firstName} lastname={user.lastName}
                phone={user.numberPhone} email={user.email} dob={user.dob} stt={start+(index+1)}/>
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
              Showing 1 to 10 of 32 entries
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
            <Sidebar active={2}/>
            <Tool curpage="Manage Users"/>
            <ManageUsers/>
        </div>
    </div>,document.getElementById("manage-users")
)