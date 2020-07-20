import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
var viewCat,main, UpdateCategory, modalSaleProduct;
function formatCurrency(cost){
  return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
class SingleCategory extends React.Component {
    constructor(props) {
      super(props);
      this.viewCategory = this.viewCategory.bind(this);
      this.confirmDelete = this.confirmDelete.bind(this);
      this.deleteCategory = this.deleteCategory.bind(this);
      this.updateCategory = this.updateCategory.bind(this);
      this.saleCategory = this.saleCategory.bind(this);
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
      UpdateCategory.setState({category:this.props.category,updateSuccess:0, image:this.props.category.image});
    }
    deleteCategory(){
      localStorage.setItem("curDelete",this.props.category._id);
    }
    confirmDelete(){
      $.post("/deleteCategory",{id:localStorage.getItem("curDelete")},function(data){
        main.setState({listCategory:data});
      })
    }
    saleCategory(){
      var that = this;
      modalSaleProduct.setState({idCategory:this.props.category._id,nameCategory:this.props.category.name});
      $.post("/getListEvents",{id:that.props.category._id},function(data){
        modalSaleProduct.setState({listEvents:data});
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
                        <a data-toggle="modal" data-target="#modalSaleCategory" class="btn btn-primary btnAction" onClick={this.saleCategory} title='Event sale product'><i class='icon-long-arrow-down'></i></a>
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
class RowSaleEvent extends React.Component {
  constructor(props){
    super(props);
  }
  offSale(){
    var that = this;
    
    $.post("/offSale",{id: modalSaleProduct.state.idCategory,idOff:this.props.event._id},function(data){
      modalSaleProduct.setState({listEvents:data.saleEvents});
      var dataSend = {
        idSale: that.props.event._id,
        nameCategory: modalSaleProduct.state.nameCategory
      }
      socket.emit("require-stop-sale",dataSend)
    })
  }
  render(){
    var date = new Date(this.props.event.end);
    var dueTime = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"
    +date.getMinutes()+":"+date.getSeconds();
    return( <tr class='active'>
    <td>{this.props.pos}</td>
    <td>{this.props.event.name}</td>
    <td>{this.props.event.discount}%</td>
    <td>{dueTime}</td>
    {this.props.event.status == "running" ? <td><button class="btn btn-danger" onClick={this.offSale.bind(this)}>OFF</button></td>:<td></td>}
  </tr>)
  }
}
class ModalSaleCategory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      idCategory:"",
      nameCategory:"",
      listEvents: [],
      addEvent: false
    }
    modalSaleProduct = this;
  }
  saleProduct(){
    var name = this.refs.eventName.value;
    var discount = this.refs.discount.value;
    var end = new Date(this.refs.endTime.value).getTime();
    var that = this;
    $.post("/addSaleEvent",{id:this.state.idCategory,name:name,discount:discount,end:end},function(data){
      that.setState({listEvents:data.data.saleEvents});
      var dt = {
        name: that.state.nameCategory,
        end: end,
        idSale : data.idSale
      }
      socket.emit("run-sale",dt);
    })
  }
  addEvent(){
    this.setState({addEvent:!this.state.addEvent});
  }
  render(){
    return(<div class="container">
    <div class="modal fade" id="modalSaleCategory" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Event Sale Product</h4>
          </div>
          <div class="modal-body">
            <button class="btn btn-success" onClick={this.addEvent.bind(this)}>
            {this.state.addEvent ? <div><i class="icon-minus-sign"></i> Hide</div>: 
            <div><i class="icon-plus-sign"></i>  Add event</div>}</button>
            {this.state.addEvent ? <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="eventName">Event name:</label> <br/>
                  <input type="text" class="form-control" ref="eventName" name="eventName"/>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="discount">Percentage discount:</label> <br/>
                  <input type="number" class="form-control" ref="discount" name="discount" max="100" min="5"/>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="discount">End of the promotional period:</label> <br/>
                  <input type="datetime-local" id="endtime" name="endtime" ref="endTime"/>
                </div>
              </div>
            </div> : <div></div>}
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty">List events are running:</label>
                  <table class='table'>
                    <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Discount</th>
                        <th class="text-center">End</th>
                        <th class="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listEvents.map(function(event,index){
                        return(<RowSaleEvent key={index} pos={index+1} event={event}/>)
                      })}
                    </tbody>
                  </table>
                </div>  
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" onClick={this.saleProduct.bind(this)}>Apply</button>
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
      listProduct:[],
      curpage: 1
    }
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    viewCat = this;
  }
  previousPage() {
    if (this.state.curpage > 1)
      this.setState({ curpage: this.state.curpage - 1 });
  }
  nextPage() {
    var length = this.state.listProduct.length;
    var perpage = 5;
    if (this.state.curpage < Math.ceil(length / perpage))
      this.setState({ curpage: this.state.curpage + 1 });
  }
  changePage(value,event){
    this.setState({curpage:value});
  }
  render(){
    var lCurProduct = [];
      var page = "";
      if (this.state.listProduct.length != 0) {
        page=[];
        var perpage = 5;
        var start = (this.state.curpage - 1) * perpage;
        var finish = start+perpage;
        if (finish>this.state.listProduct.length) finish=this.state.listProduct.length;
        lCurProduct = this.state.listProduct.slice(start, finish);    
        var numberpage = Math.ceil(this.state.listProduct.length / perpage);
        for (var i=1; i<=numberpage; i++){
          if (this.state.curpage==i){
            page.push(<li class='active'><a onClick={this.changePage.bind(this,i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
          } else {
            page.push(<li><a onClick={this.changePage.bind(this,i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
          }
        }
      }      
    return(<div class="container">
    <div class="modal fade" id="modalViewCategory" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Detail Category {this.state.name}</h4>
          </div>
          <div class="modal-body view-anything">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="name"><b>Name: </b>{this.state.name}</label>
                  {/* <input type="text" class="form-control" defaultValue={this.state.name} readonly="true"/> */}
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty"><b>Quantity: </b>{this.state.quanty}</label>
                  {/* <input type="text" class="form-control"  value={this.state.quanty} readonly="true"/> */}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty"><b>Description: </b>{this.state.description}</label> <br/>
                  {/* <textarea cols="100" rows="4" readonly="true" value={this.state.description}></textarea> */}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="quanty"><b>Image: </b></label>
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
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lCurProduct.map(function(product,index){
                        var cost = formatCurrency(product.costs[product.costs.length - 1].cost);
                        return(
                          <tr class='active' key={index}>
                            <td>{start+index+1}</td>
                            <td>{product.name}</td>
                            <td><img src={product.image.image1} width="120px" /></td>
                            <td>{cost}</td>
                            <td>{product.quanty}</td>
                            <td>{product.description}</td>
                          </tr>)
                      })}
                    </tbody>
                  </table>
                </div>  
              </div>
            </div>
              <div className="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div class='panel-footer'>
                    <ul class='pagination pagination-sm'>
                      <li>
                        <a style={{ cursor: 'pointer' }} onClick={this.previousPage}>«</a>
                      </li>
                      {page}
                      <li>
                        <a style={{ cursor: 'pointer' }} onClick={this.nextPage}>»</a>
                      </li>
                    </ul>
                    <div class='pull-right'>
                      Showing {start + 1} to {finish} of {this.state.listProduct.length} entries
                    </div>
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
var arrAddProduct = new Array();
var arrProduct = new Array();
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
    arrAddProduct.push({_id:this.props.product._id});
    this.setState({add:false});
  }
  removeProduct(){
    var value = this.props.product._id;
    arrAddProduct = arrAddProduct.filter(function(item){
      return item._id!==value;
    })
    this.setState({add:true});
  }
  render(){
    var cost = formatCurrency(this.props.product.costs[this.props.product.costs.length-1].cost);
    return(<tr class='active'>
    <td>{this.props.product.stt}</td>
    <td>{this.props.product.name}</td>
    <td><img src={this.props.product.image.image1} width="120px" /></td>
    <td>{cost}</td>
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
    var arr = UpdateCategory.state.category.listProduct;
    if (arr){
      for (var i=0; i<arr.length; i++){
        console.log(this.props.product._id+"===="+arr[i]._id);
      if (this.props.product._id == arr[i]._id){
        console.log("có disable");
        this.setState({add:false});
        break;
      }
    }
    }
  }
  addProduct(){
    arrProduct.push({_id:this.props.product._id});
    this.setState({add:false});
    $.post("/addCategory",{idPro:this.props.product._id,idCategory:UpdateCategory.state.category._id},function(data){
      
    })
  }
  removeProduct(){
    var value = this.props.product._id;
    arrProduct = arrProduct.filter(function(item){
      return item._id!==value;
    })
    this.setState({add:true});
    $.post("/removeCategory",{idPro:this.props.product._id,idCategory:UpdateCategory.state.category._id},function(data){
      
    })
  }
  render(){
    return(<tr class='active'>
    <td>{this.props.product.stt}</td>
    <td>{this.props.product.name}</td>
    <td><img src={this.props.product.image.image1} width="120px" /></td>
    <td>{formatCurrency(this.props.product.costs[this.props.product.costs.length-1].cost)}</td>
    <td>{this.props.product.quanty}</td>
    <td>{this.props.product.description}</td>
    <td><button class="btn btn-success" id="btnAddProduct" onClick={this.addProduct} disabled={!this.state.add}>Add</button>
      <button class="btn btn-danger" id="btnRemoveProduct" style={{marginLeft: "5px"}} onClick={this.removeProduct} disabled={this.state.add}>Remove</button></td>
  </tr>)
  }
}
var image={},newCategory;
var constImage = "/img/banner/defaultCategory.jpg";
class ModalNewCategory extends React.Component{
  constructor(props) {
    super(props);
    this.changeImage = this.changeImage.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.addToDatabase = this.addToDatabase.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.state = {
      AllProduct: [],
      addSuccess:0,
      curpage: 1,
      image: constImage,
      processing: false
    }
    newCategory = this;
  }
  componentDidMount(){
    var that = this;
    $.get("/getAllProducts",function(data){
      that.setState({AllProduct:data});
    })
  }
  handleImage(image){
    let imageFormObj = new FormData();
    imageFormObj.append("imageName","multer-image"+Date.now());
    imageFormObj.append("imageData",image);
    return new Promise((resolve,reject)=>{
    $.ajax({
      type: "POST",
      url: "/uploadImageCategory",
      data: imageFormObj,
      processData: false,
      contentType: false,
      success: function (data) {
        return (resolve("/img/banner/"+data));
        // category.image = "img/banner/" + data;
        // newCategory.addToDatabase(category);
      },
      fail: function (err) {
        return (reject(new Error(err)));
      }
    })
   })
  }
  changeImage(e){
    var that = this;
    image = e.target.files[0];
    $.post("/deleteImageCategory", {path: that.state.image}, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image).then(res => that.setState({ image: res }), err => console.log(err));
      }
    })  
  }
  saveCategory(){
    var category = {
      name: this.refs.name.value,
      quanty: arrAddProduct.length,
      description: this.refs.description.value,
      image: this.state.image,
      listProduct: arrAddProduct
    }
    console.log(category);
    this.addToDatabase(category);
  }

  addToDatabase(category){
    var that = this;
    this.setState({processing:true});
    //send request to server to save category
    $.post("/addNewCategory",{category: JSON.stringify(category)},function(data){
        main.setState({listCategory:data});
        that.setState({addSuccess:1,processing:false})
        that.refs.name.value = "";
        that.refs.description.value="";
        that.refs.image.value="";
        arrAddProduct = [];
    })
  }
  previousPage() {
    if (this.state.curpage > 1)
      this.setState({ curpage: this.state.curpage - 1 });
  }
  nextPage() {
    var length = this.state.AllProduct.length;
    var perpage = 5;
    if (this.state.curpage < Math.ceil(length / perpage))
      this.setState({ curpage: this.state.curpage + 1 });
  }
  changePage(value,event){
    this.setState({curpage:value});
  }
  render(){
    var notifyAddSuccess = <div></div>
    if (this.state.addSuccess ==1 ){
      notifyAddSuccess = 
      <div class="alert alert-success">
        <strong>Add Category Successfully!</strong>
      </div>
    }
    var lCurProduct = [];
    var page = "";
    if (this.state.AllProduct.length != 0) {
      page = [];
      var perpage = 5;
      var start = (this.state.curpage - 1) * perpage;
      var finish = start + perpage;
      if (finish > this.state.AllProduct.length) finish = this.state.AllProduct.length;
      lCurProduct = this.state.AllProduct.slice(start, finish);
      var numberpage = Math.ceil(this.state.AllProduct.length / perpage);
      for (var i = 1; i <= numberpage; i++) {
        if (this.state.curpage == i) {
          page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
        } else {
          page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
        }
      }
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
              <div class="form-group formImageCategory">
                <label for="image">Image:</label>
                <img src={this.state.image} width="80%"/>
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
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Description</th>
                        <th class="text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                    {lCurProduct.map(function(product,index){
                      return <SingleProduct key={index} product={product}/>
                    })}
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
            <div className="row">
              <div class='panel-footer'>
                <ul class='pagination pagination-sm'>
                  <li>
                    <a style={{ cursor: 'pointer' }} onClick={this.previousPage}>«</a>
                  </li>
                  {page}
                  <li>
                    <a style={{ cursor: 'pointer' }} onClick={this.nextPage}>»</a>
                  </li>
                </ul>
                <div class='pull-right'>
                  Showing {start + 1} to {finish} of {this.state.AllProduct.length} entries
                </div>
              </div>
            </div>
        </div>
        {notifyAddSuccess}
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" onClick={this.saveCategory}>Save</button>
        </div>
        {this.state.processing==true ? <div class="loader text-center"></div> : ""}
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
      updateSuccess: 0,
      curpage:1,
      image: "",
      processing: false
    }
    UpdateCategory = this;
    this.changeImage = this.changeImage.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.updateToDatabase = this.updateToDatabase.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }
  handleImage(image){
    let imageFormObj = new FormData();
    imageFormObj.append("imageName","multer-image"+Date.now());
    imageFormObj.append("imageData",image);
    return new Promise((resolve,reject)=>{
    $.ajax({
      type: "POST",
      url: "/uploadImageCategory",
      data: imageFormObj,
      processData: false,
      contentType: false,
      success: function (data) {
        return (resolve("/img/banner/"+data));
        // category.image = "img/banner/" + data;
        // newCategory.addToDatabase(category);
      },
      fail: function (err) {
        return (reject(new Error(err)));
      }
    })
   })
  }
  previousPage() {
    if (this.state.curpage > 1)
      this.setState({ curpage: this.state.curpage - 1 });
  }
  nextPage() {
    var length = this.state.AllProduct.length;
    var perpage = 5;
    if (this.state.curpage < Math.ceil(length / perpage))
      this.setState({ curpage: this.state.curpage + 1 });
  }
  changePage(value,event){
    this.setState({curpage:value});
  }
  componentDidMount(){
    var that = this;
    $.get("/getAllProducts",function(data){
      that.setState({AllProduct:data});
    })
  }
  changeImage(e){
    var that = this;
    image = e.target.files[0];
    $.post("/deleteImageCategory", {path: that.state.image}, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image).then(res => that.setState({image: res}), err => console.log(err));
      }
    })  
  }
  updateToDatabase(category){
    var that = this;
    this.setState({processing:true});
    $.post("/updateCategory",{category: JSON.stringify(category)},function(data){
      main.setState({listCategory:data});
      that.setState({updateSuccess:1,processing:false})
    })
  }
  updateCategory(){
    var category = {
      id: this.state.category._id,
      name: this.refs.name.value,
      quanty: arrProduct.length,
      description: this.refs.description.value,
      image: this.state.image,
      listProduct: arrProduct
    }
    this.updateToDatabase(category);
    
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
    var lCurProduct = [];
    var page = "";
    if (this.state.AllProduct.length != 0) {
      page = [];
      var perpage = 5;
      var start = (this.state.curpage - 1) * perpage;
      var finish = start + perpage;
      if (finish > this.state.AllProduct.length) finish = this.state.AllProduct.length;
      lCurProduct = this.state.AllProduct.slice(start, finish);
      var numberpage = Math.ceil(this.state.AllProduct.length / perpage);
      for (var i = 1; i <= numberpage; i++) {
        if (this.state.curpage == i) {
          page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>);
        } else {
          page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
        }
      }
    }    
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
                  <input type="text" class="form-control" id="name" ref="name" defaultValue={this.state.category.name} required />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group" key={this.state.category._id}>
                  <label for="description">Description:</label> <br />
                  <textarea cols="100" rows="4" ref="description" defaultValue={this.state.category.description}></textarea>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="form-group formImageCategory">
                  <label for="image">Image:</label>
                  <img src={this.state.image} width="80%" />
                  <input type="file" ref="image" onChange={(e) => this.changeImage(e)} required />
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
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Description</th>
                        <th class="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lCurProduct.map(function (product, index) {
                        return <SingleProductUpdate key={index+start} product={product} />
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class='panel-footer'>
                  <ul class='pagination pagination-sm'>
                    <li>
                      <a style={{ cursor: 'pointer' }} onClick={this.previousPage}>«</a>
                    </li>
                    {page}
                    <li>
                      <a style={{ cursor: 'pointer' }} onClick={this.nextPage}>»</a>
                    </li>
                  </ul>
                  <div class='pull-right'>
                    Showing {start + 1} to {finish} of {this.state.AllProduct.length} entries
                </div>
                </div>
              </div>
            </div>
          </div>
        {notifyUpdateSuccess}
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" onClick={this.updateCategory}>Save</button>
        </div>
        {this.state.processing==true ? <div class="loader text-center"></div> : ""}
      </div>
    </div>
  </div>)
  }
}
class ManageCategory extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        listCategory:[],
        processing: false
      }
      this.handleChange = this.handleChange.bind(this);
      this.clickNewCategory = this.clickNewCategory.bind(this);
      main = this;
    }
    clickNewCategory(){
      newCategory.setState({addSuccess:0})
    }
    componentDidMount(){
      var that = this;
      $.get("/getAllCategory",function(data){
        that.setState({listCategory:data});
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
          {this.state.permission==false ? 
                <div className="text-center notification">
                  <br />
                  <h3>Not permitted. Please access the following link to login!</h3>
                  <button className="btn btn-primary" onClick={() => window.location.replace("/login")} style={{ marginTop: '10px', width: 'auto' }}>Đi đến trang đăng nhập</button>
                </div> :
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
                <button class="btn btnNewSomething" data-toggle="modal" data-target="#modal-new-category" onClick={this.clickNewCategory}>
                  <i class="icon-plus-sign"></i> Add New Category
                </button>
              </div>
                <div class="row text-center" style={{ marginTop: "30px" }}>
                  {this.state.listCategory.map(function (category, index) {
                    return <SingleCategory key={index+Date.now().toString()} category={category} stt={index+1}/>
                  })}
                </div>
                <ModalViewCategory/>
                <ModalNewCategory/>
                <ModalUpdateCategory/>
                <ModalSaleCategory/>
            </div>
          </div>}
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