import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
var main,curEditOrder,view;
class Order extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
  }
  update(){
    main.setState({isUpdate:true});
    curEditOrder = this.props.order;
  }
  delete(){
    localStorage.setItem("curDelete",this.props.order._id);
  }
  confirmDelete(){
    $.post("/deleteOrder",{id:localStorage.getItem("curDelete")},function(data){
      main.setState({listOrder:data.lOrder});
    })
  }
  viewOrder(){
    var id = this.props.order._id;
    $.get("/getOrder",{id:id},function(data){
      view.setState({order:data});
    })
  }
  render() {
    return (<tr class='active'>
      <td className='text-center'>{this.props.stt}</td>
      <td className='text-center'>{this.props.order.email}</td>
      <td className='text-center'>{this.props.order.sumproductcost}đ</td>
      <td className='text-center'>{this.props.order.sumshipcost}đ</td>
      <td className='text-center'>{this.props.order.status}</td>
      <td className='text-center'>{this.props.order.time}</td>
      <td class='action'>
        <a class='btn btn-success' data-toggle='tooltip' style={{cursor:'pointer'}} title='view' data-toggle="modal" 
        data-target="#modalView" onClick={this.viewOrder}>
          <i class='icon-zoom-in'></i>
        </a>
        <a class='btn btn-info' data-toggle='tooltip' style={{cursor:'pointer', marginLeft:'3px'}} title='update status' data-toggle="modal" 
        data-target="#modalUpdate" onClick={this.update}>
          <i class='icon-edit'></i>
        </a>
        <a class='btn btn-danger' data-toggle='tooltip' style={{cursor:'pointer',marginLeft:'3px'}} title='delete' data-toggle="modal" 
        data-target="#modalDelete" onClick={this.delete}>
          <i class='icon-trash'></i>
        </a>
      </td>
      {/* modal xoa don hang*/}
      <div class="modal fade" id="modalDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5>Are you sure to delete this order?</h5>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.confirmDelete}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    </tr>)
  }
}
class UpdateOrder extends React.Component{
  constructor(props) {
    super(props);
    this.updateStatus=this.updateStatus.bind(this);
    this.cancel=this.cancel.bind(this);
  }
  updateStatus(){
    var value = this.refs.status.value;
    $.post("/updateStatus",{id:curEditOrder._id, status:value},function(data){
      main.setState({isUpdate:false,listOrder:data.lOrder});
    })
  }
  cancel(){
    main.setState({isUpdate:false});
  }
  render(){
    return(<div className='text-center'>
      <h4 style={{color:'blue'}}>Update status of order</h4>
      <select ref='status'>
        <option value="unconfirm">Unconfirm</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="processed">Processed</option>
        <option value="waitship">Waiting for shipping</option>
        <option value="shipping">Shipping</option>
        <option value="success">Success</option>
        <option value="fail">Fail</option>
        <option value="canceled">Be Canceled</option>
      </select> <br/>
      <div className="text-center" style={{paddingTop:'15px'}}>
        <button className="btn btn-danger" onClick={this.updateStatus}>Update</button>
        <button className="btn btn-primary" onClick={this.cancel} style={{marginLeft:'10px'}}>Cancel</button>
      </div>
    </div>)
    }
}
class ViewOrder extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      order:{
        email:"",
        time:"",
        timestamp: 0,
        sumproductcost: 0,
        sumshipcost:0,
        listproduct: [],
        status: "",
        code:0,
        fullname:"",
        phonenumber:"",
        address:""
      }
    }
    view = this;
  }
  render(){
    var address="",infor="";
    if (this.state.order){
      var address = this.state.order.address;
      infor = `Fullname: ${this.state.order.fullname}, Phonenumber: ${this.state.order.phonenumber}`;
    }
    return(<div class="container">
    <div class="modal fade" id="modalView" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Detail Order</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="text" class="form-control" value={this.state.order.email} readonly="true"/>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="time">Time:</label>
                  <input type="text" class="form-control"  value={this.state.order.time} readonly="true"/>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="productcost">Product Cost:</label>
                  <input type="text" class="form-control"  value={this.state.order.sumproductcost+"đ"} readonly="true"/>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="shipcost">Ship Cost:</label>
                  <input type="text" class="form-control"  value={this.state.order.sumshipcost+"đ"} readonly="true"/>
                </div>
              </div>
            </div>
            <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="status">Status:</label>
                  <input type="text" class="form-control"  value={this.state.order.status} readonly="true"/>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="code">Code:</label>
                  <input type="text" class="form-control"  value={this.state.order.code} readonly="true"/>
                </div>
              </div>
            </div>
            <div class="row">
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <div class="form-group">
                    <label for="infor">Information customer:</label>
                    <input type="text" class="form-control" value={infor} readonly="true" />
                  </div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <div class="form-group">
                    <label for="address">Address:</label>
                    <input type="text" class="form-control" value={address} readonly="true" />
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty">List product:</label>
                  <table class='table'>
                    <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Cost</th>
                        <th class="text-center">Quanty</th>
                        <th class="text-center">Size</th>
                        <th class="text-center">Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.order.listproduct.map(function(product,index){
                        return(
                          <tr class='active' key={index}>
                            <td class="text-center">{index+1}</td>
                            <td class="text-center">{product.name}</td>
                            <td class="text-center">{product.cost}đ</td>
                            <td class="text-center">{product.quanty}</td>
                            <td class="text-center">{product.size}</td>
                            <td class="text-center">{product.color}</td>
                          </tr>)
                      })}
                    </tbody>
                  </table>
                </div>  
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>)
  }
}
class ManageOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOrder: [],
      curpage: 1,
      isUpdate: false
    }
    this.handleChange = this.handleChange.bind(this);
    main = this;
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
  componentDidMount() {
    var that = this;
    $.get("/getAllOrders", function (data) {
      that.setState({ listOrder: data });
    })
  }
  changePage(value, event) {
    this.setState({ curpage: value });
  }
  handleChange(event){
    var that = this;
      $.post("/searchorder",{keysearch:event.target.value},function(data){
        that.setState({listOrder:data});
      })
  }
  render() {
    var lCurOrder = [];
    var page = "";
    if (this.state.listOrder.length != 0) {
      page = [];
      var perpage = 5;
      var start = (this.state.curpage - 1) * perpage;
      lCurOrder = this.state.listOrder.slice(start, start + perpage);
      var numberpage = Math.ceil(this.state.listOrder.length / perpage);
      for (var i = 1; i <= numberpage; i++) {
        if (this.state.curpage == i) {
          page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} >{i}</a></li>);
        } else {
          page.push(<li><a onClick={this.changePage.bind(this, i)}>{i}</a></li>)
        }
      }
    }
    var update="";
    if (this.state.isUpdate==true){
      update=<UpdateOrder/>
    }
    return (<div id='content'>
      <div class='panel panel-default grid'>
        <div class='panel-heading'>
          <i class='icon-table icon-large'></i>
          Manage Orders
            <div class='panel-tools'>
            <div class='btn-group'>
            </div>
          </div>
        </div>
        <div class='panel-body filters'>
          <div class="row">
            <h3 class="text-center"><b>LIST ORDERS</b></h3>
          </div>
          <div class='row'>
            <div class='col-md-9'>
            </div>
            <div class='col-md-3'>
              <div class='input-group'>
                <input class='form-control' placeholder='Search order' type='text' onChange={this.handleChange}/>
                <span class='input-group-btn'>
                  <button class='btn' type='button'>
                    <i class='icon-search'></i>
                  </button>
                </span>
              </div>
            </div>
            <div class="text-right" style={{ marginTop: '50px', paddingRight: '10%' }}>
            </div>
          </div>
        </div>
        {update}
        <table class='table'>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Email</th>
              <th class="text-center">Product Cost</th>
              <th class="text-center">Ship Cost</th>
              <th class="text-center">Status</th>
              <th class="text-center">Time</th>
              <th class='actions'>
                Actions
                </th>
            </tr>
          </thead>
          <tbody>
            {lCurOrder.map(function (or, index) {
              return <Order key={index} stt={start + (index + 1)} order={or} />
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
            Showing {start + 1} to {start + perpage} of {this.state.listOrder.length} entries
            </div>
        </div>
        <ViewOrder/>
      </div>
    </div>)
  }
}

ReactDOM.render(
  <div>
    <Navbar />
    <div id="wrapper">
      <Sidebar active={5}/>
      <Tool curpage="Manage Orders"/>
      <ManageOrders />
    </div>
  </div>, document.getElementById("manage-order")
)