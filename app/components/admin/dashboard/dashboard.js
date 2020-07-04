import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import Dropdown from 'react-dropdown';
import { CSVLink} from "react-csv";
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
var main;
const options = [
  'today', 'yesterday', 'last7days', 'last28days'
];
const defaultOption = options[2];
var viewClass, orderClass;
function formatCurrency(cost){
  return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
class TopViewProduct extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topView : []
    }
    viewClass = this;
  }
  componentDidMount(){
    var that = this;
    $.get("/topview",function(data){
        that.setState({topView:data});
    })
  }
  render(){
    if (this.state.topView.length!=0){
      return (<div class="row">   
      <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-md-push-1">
      <Bar
        data={{
          labels: this.state.topView.map(pro => pro.product.name),
          datasets: [
            {
              label: "View",
              backgroundColor: [
                "#3e95cd",
                "#8e5ea2",
                "#3cba9f",
                "#e8c3b9",
                "#c45850",
                "#5f55f2",
                "#ed64e4",
                "#fcb944",
                "#56d91a",
                "#38e8cb"
              ],
              data: this.state.topView.map(pro => pro.view)
            }
          ]
        }}
        options={{
          legend: { display: false },
          title: {
            display: true,
            text: "TOP VIEWED PRODUCTS"
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
      </div>
    </div>)} else return(
      <div class="row">
        <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-md-push-1 text-center">
          <h3>NO INFORMATION</h3>
        </div>
      </div>)
    
  }
}
class TopOrderProduct extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topOrder : []
    }
    orderClass = this;
  }
  componentDidMount(){
    var that = this;
    $.get("/toporder",function(data){
        that.setState({topOrder:data});
    })
  }
  render(){
    if (this.state.topOrder.length != 0) {
      return (<div class="row">
        <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-md-push-1">
          <Bar
            data={{
              labels: this.state.topOrder.map(pro => pro.product.name),
              datasets: [
                {
                  label: "Time(s)",
                  backgroundColor: [
                    "#3e95cd",
                    "#8e5ea2",
                    "#3cba9f",
                    "#e8c3b9",
                    "#c45850",
                    "#5f55f2",
                    "#ed64e4",
                    "#fcb944",
                    "#56d91a",
                    "#38e8cb"
                  ],
                  data: this.state.topOrder.map(pro => pro.view)
                }
              ]
            }}
            options={{
              legend: { display: false },
              title: {
                display: true,
                text: "TOP ORDERED PRODUCTS"
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }}
          />
        </div>
      </div>)
    } else { return(
      <div class="row">
        <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-md-push-1 text-center">
          <h3>NO INFORMATION</h3>
        </div>
      </div>)}
  }
}
const headersView = [
  { label: "Mã sản phẩm", key: "idproduct" },
  { label: "Tên sản phẩm", key: "nameproduct" },
  { label: "Số lượt xem", key: "view" }
];
const headersOrder = [
  { label: "Mã sản phẩm", key: "idproduct" },
  { label: "Tên sản phẩm", key: "nameproduct" },
  { label: "Số lượt đặt hàng", key: "order" }
];
var optionDisplay = "all", date="", optionSort="descending", optionCategory="all";
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          arrMetrics: [0,0,0,0],
          arrUsers: [],
          arrUsersBefore: [],
          activeUsers:0,
          timeOption: options[2],
          timeOption1: options[0],
          processing: false,
          processing1:false,
          permission: false,
          dataView: [],
          dataOrder: [],
          lDataCustomers:[],
          btnCurrent: 0,
          dataSellingProduct: [],
          statusCustomer: 1,
          curpage:1
        }
        main=this;
        this._onSelect = this._onSelect.bind(this);
        this._onSelect1 = this._onSelect1.bind(this);
    }
    componentDidMount(){
      var that = this;
      $.post("/getMetrics",{option:"last7days"},function(data){
        that.setState({arrMetrics:data.metrics, arrUsers:data.users, arrUsersBefore: data.usersBefore,
        activeUsers: data.countUser});
      });
      this.setState({btnCurrent:0});
      $.get("/getCloseCustomers",function(data){
        that.setState({lDataCustomers:data});
      })
      $.post("/getAllSellingProduct",{optionSort:"descending",optionCategory:"all"},function(data){
        that.setState({dataSellingProduct: data});
      })
      socket.on("update-view-product", function (data) {
        $.post("/getMetricProduct", { option: that.state.timeOption1 }, function (data) {
          viewClass.setState({ topView: data.view });
          that.setState({ timeOption1: selectedOption.value});
          var dataView = [];
          for (var i = 0; i < data.view.length; i++) {
            var product = data.view[i].product;
            dataView.push({ idproduct: product._id, nameproduct: product.name, view: data.view[i].view })
          }
          that.setState({ dataView: dataView})
        })
      });
      socket.on("update-order-product",function(data){
        $.post("/getMetricProduct", { option: that.state.timeOption1 }, function (data) {
          orderClass.setState({ topOrder: data.order });
          that.setState({ timeOption1: selectedOption.value });
          var dataOrder = [];
          for (var i = 0; i < data.order.length; i++) {
            var product = data.order[i].product;
            dataOrder.push({ idproduct: product._id, nameproduct: product.name, order: data.order[i].view })
          }
          that.setState({dataOrder: dataOrder })
        })
      })
    }
    _onSelect(selectedOption){
      var that = this;
      this.setState({processing:true});
      $.post("/getMetrics",{option:selectedOption.value},function(data){
        that.setState({arrMetrics:data.metrics, arrUsers:data.users, arrUsersBefore: data.usersBefore,
        activeUsers: data.countUser, timeOption: selectedOption.value,processing:false});
      })
    }
    _onSelect1(selectedOption){
      var that = this;
      this.setState({processing1:true});
      $.post("/getMetricProduct",{option:selectedOption.value},function(data){
        viewClass.setState({topView: data.view});
        orderClass.setState({topOrder:data.order});
        that.setState({timeOption1: selectedOption.value, processing1:false});
        var dataView = [];
        for (var i=0; i<data.view.length; i++){
          var product= data.view[i].product;
          dataView.push({idproduct:product._id,nameproduct:product.name,view:data.view[i].view})
        }
        var dataOrder=[];
        for (var i=0; i<data.order.length; i++){
          var product= data.order[i].product;
          dataOrder.push({idproduct:product._id,nameproduct:product.name,order:data.order[i].view})
        }
        that.setState({dataView:dataView,dataOrder:dataOrder})
      })
    }
    componentWillMount(){
      var that = this;
        const token = localStorage.getItem('tokenad');
        if (!token){
          this.setState({permission:false})
        }
        $.get("/admin",{token:token},function(data){
          if (data.success==0){
            localStorage.removeItem('emailad');
            localStorage.removeItem('usernamead');
            that.setState({permission:false})
          } else {
            that.setState({permission:true})
          }
        })
    }
    changeOptionDisplay(e){
      optionDisplay = e.target.value;
      var that = this;
      if (optionDisplay == "all"){
        $.post("/getAllSellingProduct",{optionSort:optionSort,optionCategory:optionCategory},function(data){
          that.setState({dataSellingProduct: data});
        })
      } else {
        if (date!=""){
          $.post("/getSpecificDateSaleProduct",{date:date,optionSort:optionSort,optionCategory:optionCategory},function(data){
            that.setState({dataSellingProduct:data});
          })
        }
      }
    }
    changeDate(e){
      var that = this;
      date = e.target.value;
      if (optionDisplay == "specific"){
        $.post("/getSpecificDateSaleProduct",{date:date,optionSort:optionSort,optionCategory:optionCategory},function(data){
          that.setState({dataSellingProduct:data});
        })
      }
    }
    sortProduct(e){
      var that = this;
      optionSort = e.target.value;
      if (optionDisplay=="all"){
        $.post("/getAllSellingProduct",{optionSort:optionSort,optionCategory:optionCategory},function(data){
          that.setState({dataSellingProduct: data});
        })
      } else {
        if (date!=""){
          $.post("/getSpecificDateSaleProduct",{date:date,optionSort:optionSort,optionCategory:optionCategory},function(data){
            that.setState({dataSellingProduct:data});
          })
        }
      }
    }
    statusCloseCustomer(){
      var that = this;
      this.setState({statusCustomer:1});
      $.get("/getCloseCustomers",function(data){
        that.setState({lDataCustomers:data});
      })
    }
    statusVisitWebsite(){
      this.setState({statusCustomer:2})
      var that = this;
      $.get("/getVisitFrequently",function(data){
        that.setState({lDataCustomers:data});
      })
    }
    statusNotOrder(){
      this.setState({statusCustomer:3})
      var that = this;
      $.get("/getNotOrder",function(data){
        that.setState({lDataCustomers:data});
      })
    }
    changePage(value,event){
      this.setState({curpage:value});
    }
    previousPage() {
      if (this.state.curpage > 1)
        this.setState({ curpage: this.state.curpage - 1 });
    }
    nextPage() {
      var perpage = 5;
      if (this.state.curpage < Math.ceil(this.state.dataSellingProduct.length / perpage))
        this.setState({ curpage: this.state.curpage + 1 });
    }
    changeCategory(e){
      optionCategory = e.target.value;
      var that = this;
      if (optionDisplay=="all"){
        $.post("/getAllSellingProduct",{optionSort:optionSort,optionCategory:optionCategory},function(data){
          that.setState({dataSellingProduct: data});
        })
      } else {
        if (date!=""){
          $.post("/getSpecificDateSaleProduct",{date:date,optionSort:optionSort,optionCategory:optionCategory},function(data){
            that.setState({dataSellingProduct:data});
          })
        }
      }
    }
    render(){
      const perpage = 5;
      var that = this;
      var start = (this.state.curpage - 1) * perpage;
      var finish = start+perpage;
      if (finish>this.state.dataSellingProduct.length) finish=this.state.dataSellingProduct.length;
        return (
          <div id="content">
            <div class="panel panel-default">
              <div class="panel-heading">
                <i class="icon-beer icon-large"></i>
                Dashboard!
                <div class="panel-tools">
                  <div class="btn-group"></div>
                </div>
              </div>
              {this.state.permission == false ? (
                <div className="text-center notification">
                  <br />
                  <h3>
                    Not permitted. Please access the following link to login!
                  </h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.replace("/login")}
                    style={{ marginTop: "10px", width: "auto" }}
                  >
                    Đi đến trang đăng nhập
                  </button>
                </div>
              ) : (
                // body dashboard
                <div class="panel-body">
                  <div>
                    <Dropdown
                      options={options}
                      onChange={this._onSelect}
                      value={this.state.timeOption}
                      placeholder="Select an option"
                    />
                  </div>
                  {this.state.processing == true ? (
                    <div class="loader text-center"></div>
                  ) : (
                    ""
                  )}
                  <div class="row">
                    <div class="fourMetrics">
                      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                        <div class="card card-stats">
                          <div class="card-body">
                            <div class="row rowb">
                              <div class="col">
                                <h5 class="card-title text-uppercase text-muted mb-0">
                                  Users
                                </h5>
                                <span class="h2 font-weight-bold mb-0">
                                  {this.state.arrMetrics[0]}
                                </span>
                              </div>
                              <div class="col-auto">
                                <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                                  <i class="ni ni-user-run"></i>
                                </div>
                              </div>
                            </div>
                            {/* <p class="mt-3 mb-0 text-sm">
                        <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                        <span class="text-nowrap">Since last month</span>
                      </p> */}
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                        <div class="card card-stats">
                          <div class="card-body">
                            <div class="row rowb">
                              <div class="col">
                                <h5 class="card-title text-uppercase text-muted mb-0">
                                  Sessions
                                </h5>
                                <span class="h2 font-weight-bold mb-0">
                                  {this.state.arrMetrics[1]}
                                </span>
                              </div>
                              <div class="col-auto">
                                <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                                  <i class="ni ni-time-alarm"></i>
                                </div>
                              </div>
                            </div>
                            {/* <p class="mt-3 mb-0 text-sm">
                        <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                        <span class="text-nowrap">Since last month</span>
                      </p> */}
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                        <div class="card card-stats">
                          <div class="card-body">
                            <div class="row rowb">
                              <div class="col">
                                <h5 class="card-title text-uppercase text-muted mb-0">
                                  Bounce Rate
                                </h5>
                                <span class="h2 font-weight-bold mb-0">
                                  {this.state.arrMetrics[2]}%
                                </span>
                              </div>
                              <div class="col-auto">
                                <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                                  <i class="ni ni-chart-pie-35"></i>
                                </div>
                              </div>
                            </div>
                            {/* <p class="mt-3 mb-0 text-sm">
                        <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                        <span class="text-nowrap">Since last month</span>
                      </p> */}
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                        <div class="card card-stats">
                          <div class="card-body">
                            <div class="row rowb">
                              <div class="col">
                                <h5 class="card-title text-uppercase text-muted mb-0">
                                  Session Duration
                                </h5>
                                <span class="h2 font-weight-bold mb-0">
                                  {this.state.arrMetrics[3]}s
                                </span>
                              </div>
                              <div class="col-auto">
                                <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                                  <i class="ni ni-watch-time"></i>
                                </div>
                              </div>
                            </div>
                            {/* <p class="mt-3 mb-0 text-sm">
                        <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                        <span class="text-nowrap">Since last month</span>
                      </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=" row metrics">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                      <Line
                        data={{
                          labels: this.state.arrUsers.map(
                            (element) => element[0]
                          ),
                          datasets: [
                            {
                              data: this.state.arrUsers.map(
                                (element) => element[1]
                              ),
                              label: this.state.timeOption,
                              borderColor: "#3e95cd",
                              fill: false,
                            },
                            {
                              data: this.state.arrUsersBefore.map(
                                (element) => element[1]
                              ),
                              label: "Previous period",
                              borderColor: "#8e5ea2",
                              fill: false,
                              borderDash: [5, 15],
                            },
                          ],
                        }}
                        options={{
                          title: {
                            display: true,
                            text: "The numbers of users",
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        }}
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 activeUser">
                      <div>
                        <h3>Active Users right now</h3>
                      </div>
                      <div>
                        <h1>{this.state.activeUsers}</h1>
                      </div>
                    </div>
                  </div>
                  <div class="page-header">
                    <h4 class="titleDashboard">Customers</h4>
                    <div class="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="card">
                          <div class="card-header card-header-tabs card-header-primary">
                            <div class="nav-tabs-navigation">
                              <div class="nav-tabs-wrapper">
                                <span class="nav-tabs-title">Tasks:</span>
                                <ul class="nav nav-tabs" data-tabs="tabs">
                                  <li class="nav-item">
                                    <a
                                      class={
                                        this.state.statusCustomer == 1
                                          ? "nav-link active"
                                          : "nav-link"
                                      }
                                      onClick={this.statusCloseCustomer.bind(
                                        this
                                      )}
                                    >
                                      Close Customers
                                      <div class="ripple-container"></div>
                                    </a>
                                  </li>
                                  <li class="nav-item">
                                    <a
                                      class={
                                        this.state.statusCustomer == 2
                                          ? "nav-link active"
                                          : "nav-link"
                                      }
                                      onClick={this.statusVisitWebsite.bind(
                                        this
                                      )}
                                    >
                                      Visit Website Frequently
                                      <div class="ripple-container"></div>
                                    </a>
                                  </li>
                                  <li class="nav-item">
                                    <a
                                      class={
                                        this.state.statusCustomer == 3
                                          ? "nav-link active"
                                          : "nav-link"
                                      }
                                      onClick={this.statusNotOrder.bind(this)}
                                    >
                                      Have not ordered
                                      <div class="ripple-container"></div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div class="card-body table-responsive">
                            <table class="table table-hover">
                              <thead>
                                <th class="text-center">#</th>
                                <th class="text-center">First Name</th>
                                <th class="text-center">Last Name</th>
                                <th class="text-center">Email</th>
                                <th class="text-center">Phone</th>
                                <th class="text-center">
                                  {this.state.statusCustomer == 1
                                    ? "Number Of Orders"
                                    : "Number of Visits"}
                                </th>
                              </thead>
                              <tbody>
                                {this.state.lDataCustomers.map(function (
                                  customer,
                                  index
                                ) {
                                  return (
                                    <tr key={index}>
                                      <td class="text-center">{index + 1}</td>
                                      <td class="text-center">
                                        {customer.firstName}
                                      </td>
                                      <td class="text-center">
                                        {customer.lastName}
                                      </td>
                                      <td class="text-center">
                                        {customer.email}
                                      </td>
                                      <td class="text-center">
                                        {customer.numberPhone}
                                      </td>
                                      <td class="text-center">
                                        {main.state.statusCustomer == 1
                                          ? customer.qorder
                                          : customer.qvisit}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="page-header">
                    <h4 class="titleDashboard">Trending products</h4>
                  </div>
                  <div>
                    <Dropdown
                      options={options}
                      onChange={this._onSelect1}
                      value={this.state.timeOption1}
                      placeholder="Select an option"
                    />
                  </div>
                  {this.state.processing1 == true ? (
                    <div class="loader text-center"></div>
                  ) : (
                    ""
                  )}
                  <div class="row text-center">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                      <h3 style={{ color: "#0c967a" }}>
                        <b>TOP VIEWED PRODUCTS</b>
                      </h3>
                      <TopViewProduct />
                      <CSVLink
                        data={this.state.dataView}
                        headers={headersView}
                        filename={"TopView-" + Date.now().toString() + ".csv"}
                      >
                        <i class="icon-download-alt"></i> Download CSV File
                      </CSVLink>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                      <h3 style={{ color: "#0c967a" }}>
                        <b>TOP ORDERED PRODUCTS</b>
                      </h3>
                      <TopOrderProduct />
                      <CSVLink
                        data={this.state.dataOrder}
                        headers={headersOrder}
                        filename={"TopOrder-" + Date.now().toString() + ".csv"}
                      >
                        <i class="icon-download-alt"></i> Download CSV File
                      </CSVLink>
                    </div>
                  </div>
                  <div class="page-header">
                    <h4 class="titleDashboard">
                      Information About Selling Product
                    </h4>
                  </div>
                  <div>
                    <div class="form-group classOption">
                      <select class="form-control optionCategory" onChange={this.changeCategory.bind(this)}>
                        <option value="" disabled selected> Choose Category</option>
                        <option value="all">All</option>
                        <option value="Men Product">Men</option>
                        <option value="Girl Product">Girl</option>
                        <option value="Kid Product">Kid</option>
                        <option value="Sneaker Product">Sneaker</option>
                        <option value="Adidas Product">Adidas</option>
                        <option value="Nike Product">Nike</option>
                        <option value="Jordan Product">Jordan</option>
                        <option value="Pumps Product">Pumps</option>
                      </select>
                    </div>
                    <div
                      class="radio classOption"
                      onChange={this.changeOptionDisplay.bind(this)}>
                      <h5>
                        <b>Option Date:</b>
                      </h5>
                      <label>
                        <input
                          class="with-gap"
                          name="date"
                          type="radio"
                          value="all"
                          defaultChecked="true"
                        />
                        <span>All</span>
                      </label>
                      <label>
                        <input
                          class="with-gap"
                          name="date"
                          type="radio"
                          value="specific"
                        />
                        <span>Specific Date:</span>
                      </label>
                      <input
                        class="with-gap"
                        type="date"
                        name="specificDate"
                        ref="specificDate"
                        onChange={this.changeDate.bind(this)}
                      />
                    </div>
                    <div
                      class="radio classOption"
                      onChange={this.sortProduct.bind(this)}
                    >
                      <h5>
                        <b>Option Sort:</b>
                      </h5>
                      <label>
                        <input
                          class="with-gap"
                          type="radio"
                          name="sort"
                          value="descending"
                          defaultChecked="true"
                        />
                        <span>Descending</span>
                      </label>
                      <label>
                        <input
                          class="with-gap"
                          type="radio"
                          name="sort"
                          value="ascending"
                        />
                        <span>Ascending</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <table class="table">
                      <thead>
                        <tr>
                          <th class="text-center">#</th>
                          <th class="text-center">Name</th>
                          <th class="text-center">Image</th>
                          <th class="text-center">Cost</th>
                          <th class="text-center">Number Of Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.dataSellingProduct
                          .slice(start, finish)
                          .map(function (product, index) {
                            return (
                              <tr key={index} class="active">
                                <td class="text-center">{start + index + 1}</td>
                                <td class="text-center">{product.name}</td>
                                <td class="text-center">
                                  <img
                                    src={product.image.image1}
                                    width="120px"
                                  />
                                </td>
                                <td class="text-center">
                                  {formatCurrency(
                                    product.costs[product.costs.length - 1].cost
                                  )}
                                </td>
                                <td class="text-center">{product.orders}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    <div class="panel-footer">
                      <ul class="pagination pagination-sm">
                        <li>
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={this.previousPage.bind(this)}
                          >
                            «
                          </a>
                        </li>
                        {Array.from(
                          Array(
                            Math.ceil(
                              that.state.dataSellingProduct.length / perpage
                            )
                          ).keys()
                        ).map(function (item, index) {
                          return (
                            <li
                              class={
                                index + 1 == that.state.curpage ? "active" : ""
                              }
                            >
                              <a
                                onClick={that.changePage.bind(that, index + 1)}
                                style={{ cursor: "pointer" }}
                              >
                                {index + 1}
                              </a>
                            </li>
                          );
                        })}
                        <li>
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={this.nextPage.bind(this)}
                          >
                            »
                          </a>
                        </li>
                      </ul>
                      <div class="pull-right">
                        Showing {start + 1} to {finish} of{" "}
                        {this.state.dataSellingProduct.length} entries
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
}
ReactDOM.render(
    <div>
        <Navbar/>
        <div id="wrapper">
            <Sidebar active={1}/>
            <Tool curpage="Dashboard"/>
            <Dashboard/>
        </div>
    </div>,document.getElementById("dashboard")
)