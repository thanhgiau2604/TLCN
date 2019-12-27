import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
class Dashboard extends React.Component{
    constructor(props){
        super(props);
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
            <div class='page-header'>
              <h4>Access the website</h4>
            </div>
            <div className="text-center">
                <h4>Today:</h4>
                <button className='btn btn-success'>20 times</button>
                <h4>This week:</h4>
                <button className='btn btn-warning'>100 times</button>
                <h4>Total:</h4>
                <button className='btn btn-danger'>1262 times</button>
            </div>
            <div class='progress'>
              {/* <div class='progress-bar progress-bar-success' style={{width: '35%'}}></div>
              <div class='progress-bar progress-bar-warning' style={{width: '20%'}}></div>
              <div class='progress-bar progress-bar-danger' style={{width: '10%'}}></div> */}
                
            </div>
            <div class='page-header'>
              <h4>Access the products</h4>
            </div>
            <div class='row text-center'>
              <h3>No information</h3>
              {/* <div class='col-md-3'>
                <input class='knob second' data-bgcolor='#d4ecfd' data-fgcolor='#30a1ec' data-height='140' data-inputcolor='#333' data-thickness='.3' data-width='140' type='text' value='50'/>
              </div>
              <div class='col-md-3'>
                <input class='knob second' data-bgcolor='#c4e9aa' data-fgcolor='#8ac368' data-height='140' data-inputcolor='#333' data-thickness='.3' data-width='140' type='text' value='75'/>
              </div>
              <div class='col-md-3'>
                <input class='knob second' data-bgcolor='#cef3f5' data-fgcolor='#5ba0a3' data-height='140' data-inputcolor='#333' data-thickness='.3' data-width='140' type='text' value='35'/>
              </div>
              <div class='col-md-3'>
                <input class='knob second' data-bgcolor='#f8d2e0' data-fgcolor='#b85e80' data-height='140' data-inputcolor='#333' data-thickness='.3' data-width='140' type='text' value='85'/>
              </div> */}
            </div>
            <div class='page-header'>
              <h4>Trending Products:</h4>
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