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
var viewCat;

class SingleCategory extends React.Component {
    constructor(props) {
      super(props);
      this.viewCategory = this.viewCategory.bind(this);
    }
    viewCategory(){
        var that = this;
        $.post("/getProductCategory",{category:that.props.category._id},function(data){
          console.log(data);
          viewCat.setState({name:data.name,quanty:data.quanty,description:data.description,image:data.image,
            listProduct:data.listProduct})
        })
    }
    render(){
        return(
        <div class="col-xs-12 col-sm-6 col-md-5 col-lg-5 boxthumbnail col-md-push-1">
            <div class="preview_outer wow fadeIn" data-wow-delay="300ms">
                <div class="thumbnail">
                    <img src={this.props.category.image} width="100%" alt="" />
                    <div class="overlay">
                        <h3 style={{color: "white"}}>{this.props.category.name}</h3>
                        <a data-toggle="modal" data-target="#modalViewCategory"  class="btn btn-primary btnAction" onClick={this.viewCategory}><i class='icon-zoom-in'></i></a>
                        <a href="#" class="btn btn-primary btnAction"><i class="icon-edit"></i></a>
                        <a href="#" class="btn btn-primary btnAction"><i class='icon-trash'></i></a>
                    </div>
                    <div class="caption">
                        <h3>{this.props.category.name}</h3>
                    </div>
                </div>	
            </div>	
        </div>)
    }
}
class ModalViewCategory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      quanty: "",
      description: "",
      image:"",
      listProduct:[]
    }
    viewCat = this;
  }
  render(){
    console.log(this.state.name);
    return(<div class="container">
    <div class="modal fade" id="modalViewCategory" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Detail Category {this.state.name}</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="name">Name:</label>
                  <input type="text" class="form-control" defaultValue={this.state.name}/>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                  <label for="quanty">Quanty:</label>
                  <input type="text" class="form-control"  value={this.state.quanty} readonly="true"/>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty">Description:</label> <br/>
                  <textarea cols="100" rows="4" readonly="true" value={this.state.description}></textarea>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty">Image:</label>
                  <img src={this.state.image} width="100%"/>
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
                        <th class="text-center">Image</th>
                        <th class="text-center">Cost</th>
                        <th class="text-center">Quanty</th>
                        <th class="text-center">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listProduct.map(function(product,index){
                        return(
                          <tr class='active' key={index}>
                            <td>{index}</td>
                            <td>{product.name}</td>
                            <td><img src={product.image.image1} width="120px" /></td>
                            <td>{product.cost}</td>
                            <td>{product.quanty}</td>
                            <td>{product.description}</td>
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
      this.state = {
        listCategory:[]
      }
    }
    componentDidMount(){
      var that = this;
      $.get("/getAllCategory",function(data){
        that.setState({listCategory:data});
      })
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
              <h3 class="text-center"><b>PRODUCT CATEGORY LIST</b></h3>
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
                <div class="row text-center" style={{ marginTop: "30px" }}>
                  {this.state.listCategory.map(function (category, index) {
                    return <SingleCategory key={index} category={category} />
                  })}
                </div>
                <ModalViewCategory/>
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
        <Sidebar active={3}/>
        <Tool />
        <ManageCategory/>
      </div>
    </div>, document.getElementById("manage-category")
  )