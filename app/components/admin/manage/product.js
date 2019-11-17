import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'



class Products extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(<tr class='active text-center'>
        <td class="align-items-center">1</td>
        <td>161737283899</td>
        <td>Sneaker1</td>
        <td class="text-center"><img src="assets/images/sneaker-4.jpg" style={{width: '120px'}}/>
        </td>
        <td>180 000đ</td>
        <td>10 000đ</td>
        <td>30</td>
        <td><div>
          39(20), 40(10)
        </div></td>
        <td>........</td>
        <td class='action'>
          <a class='btn btn-success' data-toggle='tooltip' href='#' title='Detail'>
            <i class='icon-zoom-in'></i>
          </a>
          <a class='btn btn-info' href='#'>
            <i class='icon-edit'></i>
          </a>
          <a class='btn btn-danger' href='#'>
            <i class='icon-trash'></i>
          </a>
        </td>
      </tr>)
    }
}

class ManageProducts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listProduct:[]
        }
    }
    render(){
        return(<div id='content'>
        <div class='panel panel-default grid'>
          <div class='panel-heading'>
            <i class='icon-table icon-large'></i>
            Manage Categoy
            <div class='panel-tools'>
              <div class='btn-group'>
                <a class='btn' href='#'>
                  <i class='icon-wrench'></i>
                  Settings
                </a>
                <a class='btn' href='#'>
                  <i class='icon-filter'></i>
                  Filters
                </a>
                <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Reload'>
                  <i class='icon-refresh'></i>
                </a>
              </div>
              <div class='badge'>3 record</div>
            </div>
          </div>
          <div class='panel-body filters'>
            <div class="row">
              <h3 class="text-center"><b>LIST PRODUCTS</b></h3>
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
              <div class="text-right" style={{marginTop: '50px', paddingRight: '10%'}}>
                <button class="btn btn-warning" data-toggle="modal" data-target="#modal-new-product">
                  <i class="icon-plus-sign"></i>New Product
                </button>
              </div>
            </div>
          </div>
          <table class='table'>
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th class="text-center">id</th>
                <th class="text-center">Name</th>
                <th class="text-center">Image</th>
                <th class="text-center">Cost</th>
                <th class="text-center">Shipcost</th>
                <th class="text-center">Quanty</th>
                <th class="text-center">Sizes</th>
                <th class="text-center">Description</th>
                <th class='actions'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <Products/>
              <Products/>
            </tbody>
          </table>
          <div class='panel-footer'>
            <ul class='pagination pagination-sm'>
              <li>
                <a href='#'>«</a>
              </li>
              <li class='active'>
                <a href='#'>1</a>
              </li>
              <li>
                <a href='#'>2</a>
              </li>
              <li>
                <a href='#'>3</a>
              </li>
              <li>
                <a href='#'>4</a>
              </li>
              <li>
                <a href='#'>5</a>
              </li>
              <li>
                <a href='#'>6</a>
              </li>
              <li>
                <a href='#'>7</a>
              </li>
              <li>
                <a href='#'>8</a>
              </li>
              <li>
                <a href='#'>»</a>
              </li>
            </ul>
            <div class='pull-right'>
              Showing 1 to 10 of 32 entries
            </div>
          </div>
        </div>
        
          <div class="modal fade" id="modal-new-product" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">New Product</h4>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="name">Name</label>
                      <input type="text" class="form-control" id="name"/>
                    </div>
                    <div class="form-group">
                      <label for="image">Image</label>
                      <input type="file" class="form-control" id="image"/>
                    </div>
                    <div class="form-group">
                      <label for="quanty">Quanty</label>
                      <input type="text" class="form-control" id="quanty"/>
                    </div>
                    <div class="form-group">
                      <label for="cost">Cost</label>
                      <input type="text" class="form-control" id="cost"/>
                    </div>
                    <div class="form-group">
                      <label for="shipcost">ShipCost</label>
                      <input type="text" class="form-control" id="shipcost"/>
                    </div>
                    <div class="form-group">
                      <label for="size">Sizes</label>
                      <input type="text" class="form-control" id="size"/>
                    </div>
                    <div class="form-group">
                      <label for="description">Description</label>
                      <input type="text" class="form-control" id="description"/>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
            <Sidebar/>
            <Tool/>
            <ManageProducts/>
        </div>
    </div>,document.getElementById("manage-products")
)