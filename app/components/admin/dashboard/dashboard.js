import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
import { Bar } from "react-chartjs-2";
import { connect } from 'mongoose'
var main;
class Products extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<tr class='active'>
      <td>{this.props.stt}</td>
      <td>{this.props.product.name}</td>
      <td><img src={this.props.product.image.image1} style={{ width: '120px' }} /></td>
      <td>{this.props.product.description}</td>
      <td>{this.props.count}</td>
    </tr>)
  }
}

class TopViewProduct extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topView : []
    }
  }
  componentDidMount(){
    var that = this;
    $.get("/topview",function(data){
       console.log(data.map(pro => pro.product.name));
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
            text: "TOP 10 VIEWED PRODUCTS"
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
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        main=this;
    }
    componentDidMount(){
    }
    render(){
        return(<div id='content'>
        <div class='panel panel-default'>
          <div class='panel-heading'>
            <i class='icon-beer icon-large'></i>
            Dashboard!
            <div class='panel-tools'>
              <div class='btn-group'>
                <a class='btn' href='#'>
                  {/* <i class='icon-refresh'></i>
                  Refresh statics */}
                </a>
                <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Toggle'>
                  <i class='icon-chevron-down'></i>
                </a>
              </div>
            </div>
          </div>
          <div class='panel-body'>      
            <div class='progress'>                
            </div>
            <div>
              <div class="row">
                  <div class="col-xl-3 col-md-3">
                    <div class="card card-stats">
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Total traffic</h5>
                            <span class="h2 font-weight-bold mb-0">350,897</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                              <i class="ni ni-active-40"></i>
                            </div>
                          </div>
                        </div>
                        <p class="mt-3 mb-0 text-sm">
                          <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                          <span class="text-nowrap">Since last month</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-3">
                    <div class="card card-stats">

                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">New users</h5>
                            <span class="h2 font-weight-bold mb-0">2,356</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                              <i class="ni ni-chart-pie-35"></i>
                            </div>
                          </div>
                        </div>
                        <p class="mt-3 mb-0 text-sm">
                          <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                          <span class="text-nowrap">Since last month</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-3">
                    <div class="card card-stats">

                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Sales</h5>
                            <span class="h2 font-weight-bold mb-0">924</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                              <i class="ni ni-money-coins"></i>
                            </div>
                          </div>
                        </div>
                        <p class="mt-3 mb-0 text-sm">
                          <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                          <span class="text-nowrap">Since last month</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-3">
                    <div class="card card-stats">

                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Performance</h5>
                            <span class="h2 font-weight-bold mb-0">49,65%</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                              <i class="ni ni-chart-bar-32"></i>
                            </div>
                          </div>
                        </div>
                        <p class="mt-3 mb-0 text-sm">
                          <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                          <span class="text-nowrap">Since last month</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div class='page-header'>
              <h4>Access the products</h4>
            </div>
            <div class='row text-center'>
              <h3 style={{color:'#0c967a'}}><b>TOP VIEWED PRODUCTS</b></h3>
                <TopViewProduct/>
            </div>
              <div class='page-header'>
                <h4>Trending Products:</h4>
                <div className="text-center">
                <h3 style={{color:'#0c967a'}}><b>TOP ORDERED PRODUCTS</b></h3>
                  <TopOrderProduct/>
                </div>
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
            <Sidebar active={1}/>
            <Tool curpage="Dashboard"/>
            <Dashboard/>
        </div>
    </div>,document.getElementById("dashboard")
)