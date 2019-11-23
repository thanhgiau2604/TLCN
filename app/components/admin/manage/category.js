import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'

class SingleProduct extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){

    }
}

class SingleCategory extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){
        return(<div class="row text-center" style={{marginTop:"30px"}}>
        <div class="col-xs-12 col-sm-6 col-md-5 col-lg-5 boxthumbnail col-md-push-1">
            <div class="preview_outer wow fadeIn" data-wow-delay="300ms">
                <div class="thumbnail">
                    <img src="img/category-header.jpg" width="100%" alt="" />
                    <div class="overlay">
                        <h3 style={{color: "white"}}>GIÀY NAM</h3>
                        <a href="#" class="btn btn-primary btnAction"><i class='icon-zoom-in'></i></a>
                        <a href="#" class="btn btn-primary btnAction"><i class="icon-edit"></i></a>
                        <a href="#" class="btn btn-primary btnAction"><i class='icon-trash'></i></a>
                    </div>
                    <div class="caption">
                        <h3>GIÀY NAM</h3>
                        <p>
                            Bạn có thể thêm, sửa, xóa các loại giày
                        </p>
                    </div>
                </div>	
            </div>	
        </div>   
    </div>)
    }
}

class ListProductCategory extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){

    }
}

class ManageCategory extends React.Component {
    constructor(props) {
      super(props);
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
              <h3 class="text-center"><b>LIST CATEGORY</b></h3>
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
              <div class="text-right" style={{marginTop: "50px", paddingRight: "10%"}}>
                <button class="btn btn-warning" data-toggle="modal" data-target="#modal-new-category">
                  <i class="icon-plus-sign"></i>New Category
                </button>
              </div>
                <SingleCategory/>
            </div>
          </div>
      </div>
      </div>)
    }
}

ReactDOM.render(
    <div>
      <Navbar />
      <div id="wrapper">
        <Sidebar />
        <Tool />
        <ManageCategory/>
      </div>
    </div>, document.getElementById("manage-category")
  )