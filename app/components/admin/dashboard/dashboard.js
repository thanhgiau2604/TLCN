import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
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
        that.setState({topView:data});
    })
  }
  render(){
    return(<table class='table'>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Name</th>
        <th class="text-center">Image</th>
        <th class="text-center">Description</th>
        <th class="text-center">Count</th>
      </tr>
    </thead>
    <tbody>
      {this.state.topView.map(function (view, index) {
        return <Products key={index} stt={index + 1} product={view.product} count={view.view} />
      })}
    </tbody>
  </table>)
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
    return(<table class='table'>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Name</th>
        <th class="text-center">Image</th>
        <th class="text-center">Description</th>
        <th class="text-center">View</th>
      </tr>
    </thead>
    <tbody>
      {this.state.topOrder.map(function (order, index) {
        return <Products key={index} stt={index + 1} product={order.product} count={order.view} />
      })}
    </tbody>
  </table>)
  }
}
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        main=this;
    }
    componentDidMount(){
      var that = this;
      $.get("/topview",function(data){
        console.log(data);
        $.get("/toporder",function(da){
          console.log(da);
          that.setState({topView:data,topOrder:da});
        })
      })
      
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
            <div class='page-header'>
              <h4>Access the products</h4>
            </div>
            <div class='row text-center'>
              <h3 style={{color:'#0c967a'}}><b>TOP 10 VIEWED PRODUCTS</b></h3>
                <TopViewProduct/>
            </div>
              <div class='page-header'>
                <h4>Trending Products:</h4>
                <div className="text-center">
                <h3 style={{color:'#0c967a'}}><b>TOP 10 ORDERED PRODUCTS</b></h3>
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