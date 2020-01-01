import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'

var viewCat,main, UpdateCategory;

class SingleCategory extends React.Component {
    constructor(props) {
      super(props);
      this.viewCategory = this.viewCategory.bind(this);
      this.confirmDelete = this.confirmDelete.bind(this);
      this.deleteCategory = this.deleteCategory.bind(this);
      this.updateCategory = this.updateCategory.bind(this);
    }
    viewCategory(){
        var that = this;
        $.post("/getProductCategory",{category:that.props.category._id},function(data){
          console.log(data);
          viewCat.setState({name:data.name,quanty:data.quanty,description:data.description,image:data.image,
            listProduct:data.listProduct})
        })
    }
    updateCategory(){
      UpdateCategory.setState({category:this.props.category,updateSuccess:0});
    }
    deleteCategory(){
      localStorage.setItem("curDelete",this.props.category._id);
    }
    confirmDelete(){
      $.post("/deleteCategory",{id:localStorage.getItem("curDelete")},function(data){
        main.setState({listCategory:data});
      })
    }
    render(){
        return(
        <div class="col-xs-10 col-sm-5 col-md-5 col-lg-5 boxthumbnail col-md-push-1">
            <div class="preview_outer wow fadeIn" data-wow-delay="300ms">
                <div class="thumbnail">
                    <img src={this.props.category.image} width="100%" alt="" />
                    <div class="overlay">
                        <h3 style={{color: "white"}}>{this.props.category.name}</h3>
                        <a data-toggle="modal" data-target="#modalViewCategory"  class="btn btn-primary btnAction" onClick={this.viewCategory}><i class='icon-zoom-in'></i></a>
                        <a data-toggle="modal" data-target="#modalEditCategory" class="btn btn-primary btnAction" onClick={this.updateCategory}><i class="icon-edit"></i></a>
                        <a data-toggle="modal" data-target="#modalDeleteCategory" class="btn btn-primary btnAction" onClick={this.deleteCategory}><i class='icon-trash'></i></a>
                    </div>
                    <div class="caption">
                        <h3>{this.props.category.name}</h3>
                    </div>
                </div>	
            </div>	
            {/* modal xoa Category */}
            <div class="modal fade" id="modalDeleteCategory" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Confirm</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <h5>Are you sure to delete this category?</h5>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.confirmDelete}>Yes</button>
                  </div>
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
                  <input type="text" class="form-control" defaultValue={this.state.name} readonly="true"/>
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
                            <td>{index+1}</td>
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
var arrProduct=[];
class SingleProduct extends React.Component {
  constructor(props) {
    super(props);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.state = {
      add:true
    }
  }
  addProduct(){
    arrProduct.push({_id:this.props.product._id});
    this.setState({add:false});
  }
  removeProduct(){
    var value = this.props.product._id;
    arrProduct = arrProduct.filter(function(item){
      return item._id!==value;
    })
    this.setState({add:true});
  }
  render(){
    return(<tr class='active'>
    <td>{this.props.product.stt}</td>
    <td>{this.props.product.name}</td>
    <td><img src={this.props.product.image.image1} width="120px" /></td>
    <td>{this.props.product.cost}</td>
    <td>{this.props.product.quanty}</td>
    <td>{this.props.product.description}</td>
    <td><button class="btn btn-success" id="btnAddProduct" onClick={this.addProduct} disabled={!this.state.add}>Add</button>
      <button class="btn btn-danger" id="btnRemoveProduct" style={{marginLeft: "5px"}} onClick={this.removeProduct} disabled={this.state.add}>Remove</button></td>
  </tr>)
  }
}

class SingleProductUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.state = {
      add:true
    }
  }
  componentDidMount(){
    var arr = [];
    arr = UpdateCategory.state.category.listProduct;
    if (arr){
      for (var i=0; i<arr.length; i++){
      if (this.props.product._id == arr[i]._id){
        this.setState({add:false});
        break;
      }
    }
    }
  }
  addProduct(){
    arrProduct.push({_id:this.props.product._id});
    this.setState({add:false});
  }
  removeProduct(){
    var value = this.props.product._id;
    arrProduct = arrProduct.filter(function(item){
      return item._id!==value;
    })
    console.log(arrProduct);
    this.setState({add:true});
  }
  render(){
    return(<tr class='active'>
    <td>{this.props.product.stt}</td>
    <td>{this.props.product.name}</td>
    <td><img src={this.props.product.image.image1} width="120px" /></td>
    <td>{this.props.product.cost}</td>
    <td>{this.props.product.quanty}</td>
    <td>{this.props.product.description}</td>
    <td><button class="btn btn-success" id="btnAddProduct" onClick={this.addProduct} disabled={!this.state.add}>Add</button>
      <button class="btn btn-danger" id="btnRemoveProduct" style={{marginLeft: "5px"}} onClick={this.removeProduct} disabled={this.state.add}>Remove</button></td>
  </tr>)
  }
}
var image={},newCategory;
class ModalNewCategory extends React.Component{
  constructor(props) {
    super(props);
    this.changeImage = this.changeImage.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.addToDatabase = this.addToDatabase.bind(this);
    this.state = {
      AllProduct: [],
      addSuccess:0
    }
    newCategory = this;
  }
  componentDidMount(){
    var that = this;
    $.get("/getAllProducts",function(data){
      that.setState({AllProduct:data});
    })
  }
  changeImage(e){
    image = e.target.files[0];
  }
  saveCategory(){
    var category = {
      name: this.refs.name.value,
      quanty: arrProduct.length,
      description: this.refs.description.value,
      image: "",
      listProduct: arrProduct
    }
    let imageFormObj = new FormData();
    imageFormObj.append("imageName","multer-image"+Date.now());
    imageFormObj.append("imageData",image);
    $.ajax({
      type: "POST",
      url: "/uploadImageCategory",
      data: imageFormObj,
      processData: false,
      contentType: false,
      success: function (data) {
        category.image = "img/banner/" + data;
        newCategory.addToDatabase(category);
      },
      fail: function (err) {
        alert(err);
      }
    })
  }

  addToDatabase(category){
    var that = this;
    //send request to server to save category
    $.post("/addNewCategory",{category: JSON.stringify(category)},function(data){
        main.setState({listCategory:data});
        that.setState({addSuccess:1})
        that.refs.name.value = "";
        that.refs.description.value="";
        that.refs.image.value="";
        arrProduct = [];
    })
  }
  render(){
    var notifyAddSuccess = <div></div>
    if (this.state.addSuccess ==1 ){
      notifyAddSuccess = 
      <div class="alert alert-success">
        <strong>Add Category Successfully!</strong>
      </div>
    }
    return(<div class="modal fade" id="modal-new-category" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">New Category</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" id="name" ref="name" required/>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="description">Description:</label> <br/>
                <textarea cols="100" rows="4" ref="description"></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="image">Image:</label>
                <input type="file" ref="image" onChange={(e)=> this.changeImage(e)} required/>
              </div>     
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label>Add product into category:</label>
                <table class='table'>
                  <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Image</th>
                        <th class="text-center">Cost</th>
                        <th class="text-center">Quanty</th>
                        <th class="text-center">Description</th>
                        <th class="text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.AllProduct.map(function(product,index){
                      return <SingleProduct key={index} product={product}/>
                    })}
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
        </div>
        {notifyAddSuccess}
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" onClick={this.saveCategory}>Save</button>
        </div>
      </div>
    </div>
  </div>)
  }
}
var isChangeImage = 0;
class ModalUpdateCategory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      AllProduct: [],
      category: "",
      updateSuccess: 0
    }
    UpdateCategory = this;
    this.changeImage = this.changeImage.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.updateToDatabase = this.updateToDatabase.bind(this);
  }
  componentDidMount(){
    var that = this;
    $.get("/getAllProducts",function(data){
      that.setState({AllProduct:data});
    })
  }
  changeImage(e){
    image = e.target.files[0];
    isChangeImage = 1;
  }
  updateToDatabase(category){
    var that = this;
    $.post("/updateCategory",{category: JSON.stringify(category)},function(data){
      main.setState({listCategory:data});
      that.setState({updateSuccess:1})
    })
  }
  updateCategory(){
    console.log(this.refs.description.value);
    var category = {
      id: this.state.category._id,
      name: this.refs.name.value,
      quanty: arrProduct.length,
      description: this.refs.description.value,
      image: this.state.category.image,
      listProduct: arrProduct
    }

    if (isChangeImage == 1) {
      let imageFormObj = new FormData();
      imageFormObj.append("imageName", "multer-image" + Date.now());
      imageFormObj.append("imageData", image);
      $.ajax({
        type: "POST",
        url: "/uploadImageCategory",
        data: imageFormObj,
        processData: false,
        contentType: false,
        success: function (data) {
          category.image = "img/banner/" + data;
          UpdateCategory.updateToDatabase(category);
        },
        fail: function (err) {
          alert(err);
        }
      })
    } else {
      this.updateToDatabase(category);
    }
    
  }
  render(){
    var notifyUpdateSuccess = <div></div>
    if (this.state.updateSuccess ==1 ){
      notifyUpdateSuccess = 
      <div class="alert alert-success">
        <strong>Update Category Successfully!</strong>
      </div>
    }
    arrProduct = this.state.category.listProduct;
    return(<div class="modal fade" id="modalEditCategory" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Update Category</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="form-group" key={this.state.category._id}>
                <label for="name">Name:</label>
                <input type="text" class="form-control" id="name" ref="name" defaultValue={this.state.category.name} required/>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group" key={this.state.category._id}>
                <label for="description">Description:</label> <br/>
                <textarea cols="100" rows="4" ref="description" defaultValue={this.state.category.description}></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="image">Image:</label>
                <input type="file" ref="image" onChange={(e)=> this.changeImage(e)} required/>
              </div>     
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="form-group" key={this.state.category._id}>
                <label>Update product into category:</label>
                <table class='table'>
                  <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Image</th>
                        <th class="text-center">Cost</th>
                        <th class="text-center">Quanty</th>
                        <th class="text-center">Description</th>
                        <th class="text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.AllProduct.map(function(product,index){
                      return <SingleProductUpdate key={index} product={product}/>
                    })}
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
        </div>
        {notifyUpdateSuccess}
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" onClick={this.updateCategory}>Save</button>
        </div>
      </div>
    </div>
  </div>)
  }
}

class ManageCategory extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        listCategory:[]
      }
      this.handleChange = this.handleChange.bind(this);
      main = this;
    }
    componentDidMount(){
      var that = this;
      $.get("/getAllCategory",function(data){
        that.setState({listCategory:data});
      })
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
    handleChange(event){
      var that = this;
      $.post("/searchcategory",{keysearch:event.target.value},function(data){
        that.setState({listCategory:data});
      })
    }
    render(){
        return(<div id='content'>
        <div class='panel panel-default grid'>
          <div class='panel-heading'>
            <i class='icon-table icon-large'></i>
            Manage Category Product
            <div class='panel-tools'>
              <div class='btn-group'>
                 {/* <a class='btn' href='#'>
                  <i class='icon-wrench'></i>
                  Settings
                </a>
                <a class='btn' href='#'>
                  <i class='icon-filter'></i>
                  Filters
                </a>
                <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Reload'>
                  <i class='icon-refresh'></i>
                </a> */}
              </div>
              {/* <div class='badge'>3 record</div>  */}
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
                  <input class='form-control' placeholder='Search category' type='text' onChange={this.handleChange}/>
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
                    return <SingleCategory key={index} category={category} stt={index+1}/>
                  })}
                </div>
                <ModalViewCategory/>
                <ModalNewCategory/>
                <ModalUpdateCategory/>
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
        <Tool curpage="Mange Category Product"/>
        <ManageCategory/>
      </div>
    </div>, document.getElementById("manage-category")
  )