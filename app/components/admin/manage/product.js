import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'
import Viewer from 'react-viewer';
import readXlsxFile from 'read-excel-file';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
var main;
var curEditProduct, commentClass, singleCommentClass;
function formatCurrency(cost){
  return cost.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
class Products extends React.Component {
  constructor(props) {
    super(props);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.restoreProduct = this.restoreProduct.bind(this);
    this.showComment = this.showComment.bind(this);
  }
  showComment(){
    var that = this;
    localStorage.setItem("idProduct",this.props.product._id);
    $.post("/showComment",{idProduct:this.props.product._id},function(data){
      console.log(data);
      commentClass.setState({listComments:data, idProduct:that.props.product._id});
    })
  }
  updateProduct(){
    var constImage = "/img/product/default.png";
    var image1=constImage, image2=constImage, image3=constImage;
    if (this.props.product.image&&this.props.product.image.image1!="") image1 = this.props.product.image.image1;
    if (this.props.product.image&&this.props.product.image.image2!="") image2 = this.props.product.image.image2;
    if (this.props.product.image&&this.props.product.image.image3!="") image3 = this.props.product.image.image3;
    curEditProduct.setState({product:this.props.product,updateSuccess:0, curcost:this.props.product.costs[this.props.product.costs.length-1].cost,
      curSizes:this.props.product.sizes.length, image1:image1, image2:image2, image3:image3});
  }
  deleteProduct(){
    localStorage.setItem("curDelete",this.props.product._id);
  }
  confirmDelete(){
    $.post("/deleteProduct",{id:localStorage.getItem("curDelete")},function(data){
      main.setState({listProduct:data.lProduct});
    })
  }
  restoreProduct(){
    $.post("/restoreProduct",{id:this.props.product._id},function(data){
      main.setState({listProduct:data.lProduct});
    })
  }
  render() {
    if (main.state.listProduct.length != 0) {
      var strSize = "";
      var that = this;
      this.props.product.sizes.forEach(function (size, i) {
        strSize += size.size + "(";
        size.colors.forEach(function (color, index) {
          strSize += color.color + ":" + color.quanty;
          if (index + 1 < size.colors.length) strSize += ", ";
        });
        strSize += ")";
        if (i + 1 < that.props.product.sizes.length) strSize += ", "
      });
    }
    var isDeleted=0, classDeleted ="";
    console.log(this.props.product.isDeleted);
    if (this.props.product.isDeleted) { 
      isDeleted=this.props.product.isDeleted;
      classDeleted = 'deleted';
    }
    var image = "/img/product/default.png"
    var cost = formatCurrency(this.props.product.costs[this.props.product.costs.length-1].cost);
    if (this.props.product.image) image = this.props.product.image.image1;
    return (<tr class={'active '+classDeleted}>
      <td>{this.props.stt}</td>
      <td>{this.props.product.name}</td>
      <td><img src={image} style={{ width: '120px' }} />
      </td>
      <td>{cost}</td>
      <td>{this.props.product.quanty}</td>
      <td>{strSize}</td>
      <td>{this.props.product.description}</td>
      <td class='action'>
        <a class='btn btn-info' data-toggle='tooltip' style={{cursor:'pointer'}} title='edit' data-toggle="modal" 
        data-target="#modalUpdateProduct" onClick={this.updateProduct}>
          <i class='icon-edit'></i>
        </a>
        <a class='btn btn-danger' data-toggle='tooltip' style={{cursor:'pointer'}} title='delete' data-toggle="modal" 
        data-target="#modalDeleteProduct" onClick={this.deleteProduct}>
          <i class='icon-trash'></i>
        </a>
        {isDeleted==1 ? <a class='btn btn-primary' data-toggle='tooltip' style={{ cursor: 'pointer',marginLeft:'3px'}} title='Restore' onClick={this.restoreProduct}>
        <i class='icon-undo'></i></a> : ""}
        <a class='btn btn-primary' data-toggle='tooltip' style={{cursor:'pointer'}} title='comments' data-toggle="modal" 
        data-target="#modalDisplayComment" onClick={this.showComment}>
          <i class='icon-comments'></i>
        </a>
      </td>
      {/* modal xoa product */}
      <div class="modal fade" id="modalDeleteProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5>Are you sure to delete this product?</h5>
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
var classNewProduct;
var constImage = "/img/product/default.png";
var image1, image2, image3;
class NewProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curSizes: 1,
      addSuccess:0,
      image1: constImage,
      image2: constImage,
      image3: constImage
    }
    this.AddSize = this.AddSize.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.ChangeImage1 = this.ChangeImage1.bind(this);
    this.ChangeImage2 = this.ChangeImage2.bind(this);
    this.ChangeImage3 = this.ChangeImage3.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.AddToDatabase = this.AddToDatabase.bind(this);
  }
  AddSize() {
    this.setState({ curSizes: this.state.curSizes + 1 });
  }
  ChangeImage1(e){
    var that = this;
    image1 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image1 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image1).then(res => that.setState({ image1: res }), err => console.log(err));
      }
    })  
  }
  ChangeImage2(e){
    var that = this;
    image2 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image2 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image2).then(res => that.setState({ image2: res }), err => console.log(err));
      }
    })  
  }
  ChangeImage3(e){
    var that = this;
    image3 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image3 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image3).then(res => that.setState({ image3: res }), err => console.log(err));
      }
    })  
  }
  handleImage(image){
    let imageFormObj = new FormData();
    imageFormObj.append("imageName","multer-image"+Date.now());
    imageFormObj.append("imageData",image);
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "POST",
            url: "/upload",
            data: imageFormObj,
            processData: false,
            contentType: false,
            success: function (data) {
                return (resolve("/img/product/"+data));
            },
            fail: function(err) {
                return (reject(new Error(err)));
            }
        })
    })
}
  AddToDatabase(product){
    var that = this;
    console.log(product);
    //send request to server to save product
    $.post("/addNewProduct",{product: JSON.stringify(product)},function(data){
      if (data.success==1){
        main.setState({listProduct:data.lProduct});
        that.setState({addSuccess:1,curSizes:1})
        that.refs.name.value = "";
        that.refs.cost.value="";
        that.refs.image.value="";
        that.refs.description.value="";
        that.refs.size1.value="";
        that.refs.color1.value="";
      }
    })
  }
  submitForm(e) {
    var sizes = [];
    for (var i = 1; i <= this.state.curSizes; i++) {
      var cursize = this.refs["size" + i].value;
      var curColorQuanty = this.refs["color" + i].value;
      curColorQuanty = curColorQuanty.replace(/\s/g, "");
      var arrayCorlorQuanty = curColorQuanty.split(",");
      var colors = [];
      for (var j = 0; j < arrayCorlorQuanty.length; j++) {
        var arrcq = arrayCorlorQuanty[j].split(":");
        var color = {
          color: arrcq[0],
          quanty: parseInt(arrcq[1])
        }
        colors.push(color);
      }
      var size = {
        size: parseInt(cursize),
        colors: colors
      }
      sizes.push(size);
    }
    var newP = {
      name: this.refs.name.value,
      quanty: 0,
      costs: [{cost:this.refs.cost.value}],
      image: {image1:this.state.image1,image2:this.state.image2,image3:this.state.image3},
      description: this.refs.description.value,
      sizes: sizes,
      votes: {
        "vote1": 0,
        "vote2": 0,
        "vote3": 0,
        "vote4": 0,
        "vote5": 0
      },
      createat: parseInt(Date.now().toString()),
      views:0,
      orders: 0,
      isDeleted: 0,
    }
    this.AddToDatabase(newP);
    e.preventDefault();
  }
  componentDidMount(){
    this.setState({addSuccess:0})
  }
  render() {
    var arrSizes = [];
    for (var i = 1; i <= this.state.curSizes; i++) {
      var htmlSize = (<div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
          <label>Size:</label>
          <input type="text" className="form-control"  placeholder="Enter size" name="size" ref={"size" + i} required />
        </div>
        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
          <label>Color:</label>
          <input type="text" className="form-control" placeholder="color1:quanty1,color2:quanty2,..." name="color" ref={"color" + i} required/>
        </div>
        <br />
      </div>);
      arrSizes.push(htmlSize);
    }
    var notifyAddSuccess = <div></div>
    if (this.state.addSuccess==1){
    notifyAddSuccess = 
      <div class="alert alert-success">
        <strong>Add Product Successfully!</strong>
      </div>
    }
    return (<div className="modal fade right " id="modalNewProduct" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-full-height modal-right modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title w-100 text-center" id="myModalLabel">Add New Product</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <div className="form-group">
                  <label>Product Name:</label>
                  <input type="text" className="form-control" placeholder="Enter name" ref="name" required/>
                </div>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <div className="form-group">
                  <label>Cost(VND):</label>
                  <input type="text" className="form-control" placeholder="Enter cost" ref="cost" required/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label>Description:</label> <br />
                <textarea rows="5" style={{ width: "100%" }} ref="description"></textarea>
              </div>
            </div>
            {arrSizes}
            <div className="row" style={{ marginTop: "10px" }}>
              <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <button className="btn btn-success" onClick={this.AddSize}>Add size</button>
              </div>
            </div>
            <div class="row" style={{marginTop:'10px'}}>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image1} width="100%"/>
                  <label>Image 1:</label>
                  <input type="file" className="form-control" ref="image1" onChange={(e) => this.ChangeImage1(e)} required />
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image2} width="100%"/>
                  <label>Image 2:</label>
                  <input type="file" className="form-control" ref="image2" onChange={(e) => this.ChangeImage2(e)} />
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image3} width="100%"/>
                  <label>Image 3:</label>
                  <input type="file" className="form-control" ref="image3" onChange={(e) => this.ChangeImage3(e)} />
                </div>
            </div>
            </div>
          </div>
          {notifyAddSuccess}
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-danger" type="submit" onClick={this.submitForm}>Add product</button>
          </div>
        </div>
      </div>
    </div>)
  }
}
var constImage = "/img/product/default.png";
var image1, image2, image3;
class CommentBox extends React.Component {
    constructor(props){
        super(props);
        this.handleComment = this.handleComment.bind(this);
        this.state = {
            image1: constImage,
            image2: constImage,
            image3: constImage,
            addImage: false,
            processing: false
        }
        this.changeStatus = this.changeStatus.bind(this);
        this.ChangeImage1 = this.ChangeImage1.bind(this);
        this.ChangeImage2 = this.ChangeImage2.bind(this);
        this.ChangeImage3 = this.ChangeImage3.bind(this);
        this.handleImage = this.handleImage.bind(this);
    }
    handleComment(){
        this.setState({processing:true});
        var comment = this.refs.yourComment.value;
        var that = this;
        console.log("idProduct="+localStorage.getItem("idProduct"));
        $.post("/addResponse",{idProduct:localStorage.getItem("idProduct"),content:comment,
        image1: this.state.image1, image2: this.state.image2, image3: this.state.image3,
        idComment:this.props.id},function(data){
            document.getElementById("taComment").value = "";
            commentClass.setState({listComments:data});
            that.setState({image1:constImage, image2: constImage, image3: constImage, addImage:false, processing:false});
        })
    }
    handleImage(image){
        let imageFormObj = new FormData();
        imageFormObj.append("imageName","multer-image"+Date.now());
        imageFormObj.append("imageData",image);
        return new Promise((resolve,reject)=>{
            $.ajax({
                type: "POST",
                url: "/uploadImageComment",
                data: imageFormObj,
                processData: false,
                contentType: false,
                success: function (data) {
                    return (resolve("/img/comments/"+data));
                },
                fail: function(err) {
                    return (reject(new Error(err)));
                }
            })
        })
    }
    ChangeImage1(e){
        var that = this;
        image1 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image1}, function (data) {
            if (data == 1) {
                that.handleImage(image1).then(res => that.setState({image1:res}), err => console.log(err));
            }
        })  
    }
    ChangeImage2(e){
        var that = this;
        image2 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image2}, function (data) {
            if (data == 1) {
                that.handleImage(image2).then(res => that.setState({image2:res}), err => console.log(err));
            }
        })  
    }
    ChangeImage3(e){
        var that = this;
        image3 = e.target.files[0];
        $.post("/deleteImage", {path: that.state.image3}, function (data) {
            if (data == 1) {
                that.handleImage(image3).then(res => that.setState({image3:res}), err => console.log(err));
            }
        })  
    }
    changeStatus(){
        this.setState({addImage:!this.state.addImage});
}
    render(){
        return (<div class="yourComment">
            <textarea placeholder="Your response?" class="urTextComment" rows="3" ref="yourComment" id="taComment">
            </textarea>
            { this.state.addImage==false ? <button class="btn btn-default btnImage" onClick={this.changeStatus}>Add images</button> :
                <div><button class="btn btn-default btnImage" onClick={this.changeStatus}>Hide images</button>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 imageDivComment">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image1} ref="image1" width="80%" />
                        <label>Image 1:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage1(e)} required />
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image2} ref="image2" width="80%" />
                        <label>Image 2:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage2(e)} />
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img src={this.state.image3} ref="image3" width="80%" />
                        <label>Image 3:</label>
                        <input type="file" className="form-control" onChange={(e) => this.ChangeImage3(e)} />
                    </div>
                </div>
                </div>}
            <button class="postComment btn btn-primary" onClick={this.handleComment}>Post</button>
            {this.state.processing==true ? <div class="loader text-center"></div> : ""}
        </div>)
    }
}
var display;
class DisplayImage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            pos:0
        }
        this.setVisible = this.setVisible.bind(this);
        this.setDisable = this.setDisable.bind(this);
        display=this;
    }
    setVisible(index){
        this.setState({visible:true, pos:index});
    }
    setDisable(){
        this.setState({visible:false})
    }
    render(){
      var that = this;
        return (
            <div>
                {this.props.listImage.map(function (image, index) {
                    return (<img src={image.src} width="20%" key={index} onClick={() => that.setVisible(index)}/>)
                })}
              <Viewer
              visible={this.state.visible}
              onClose={this.setDisable }
              images={this.props.listImage}
              activeIndex={this.state.pos}
              zIndex="100000"
              />
            </div>
          );
    }
}
class SingleComment extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      responsing: false
    }
    this.isReply = this.isReply.bind(this);
  }
  isReply(){
    this.setState({responsing:!this.state.responsing})
  }
  render(){
    return(<div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-md-push-1">
    <div class="singleComment">
      <h4 style={{ fontWeight: "700", color: "blue" }}>{this.props.comment.username}
        <span style={{ color: "black" }}> : {this.props.comment.date}</span>
      </h4>
      <div class="contentComment">
        <p class="textComment">{this.props.comment.content}</p>
      </div>
      {this.props.comment.images.length > 0 ?
         
        <div class="displayImage">
          <DisplayImage listImage={this.props.comment.images.map(image => ({src:image.image,alt:''}))}/>
        </div> : <div></div>
      }
      <a class="response" onClick={this.isReply}>Reply</a>
    </div>
    {this.props.comment.responses.length>0 ?
       this.props.comment.responses.map(function(response,index){
        return (<div class="singleAdReponse">
          <div class="divComment">
          <h4 style={{ fontWeight: "700", color: "red" }}>ADMIN
          <span style={{ color: "black" }}> : {response.date}</span>
          </h4>
          <div class="contentComment">
            <p class="textComment">{response.content}</p>
          </div>
            {response.images.length > 0 ?
              <div class="displayImage">
                <DisplayImage listImage={response.images.map(image => ({src:image.image,alt:''}))}/>
              </div> : <div></div>
            }
        </div></div>)
      }) :<div></div>}
    {this.state.responsing==true ? <CommentBox id={this.props.comment._id}/> : ""}
  </div>)
  }
}
class Comments extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      listComments: [],
      idProduct:""
    }
    commentClass=this;
  }
  render(){
    return(<div className="modal fade right " id="modalDisplayComment" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div className="modal-dialog modal-full-height modal-right modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title w-100 text-center" id="myModalLabel">List comments</h4>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
          <div className="row">
            {this.state.listComments.map(function (comment, index) {
              return(<SingleComment comment={comment} key={index}/>)})}
            
          </div>
        </div>
      <div className="modal-footer justify-content-center">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">close</button>
      </div>
    </div>
  </div>
   </div>)
  }
}
class UpdateProduct extends React.Component{
  constructor(props) {
    super(props);
    this.AddSize = this.AddSize.bind(this);
    this.RemoveSize = this.RemoveSize.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.ChangeImage1 = this.ChangeImage1.bind(this);
    this.ChangeImage2 = this.ChangeImage2.bind(this);
    this.ChangeImage3 = this.ChangeImage3.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.state = {
      product:"",
      curcost: 0,
      updateSuccess:0,
      curSizes: 0,
      image1: "",
      image2: "",
      image3: "",
      processing:false
    }
    curEditProduct = this;
  }
  AddSize(){
    this.setState({curSizes:this.state.curSizes+1})
  }
  RemoveSize(){
    this.setState({curSizes:this.state.curSizes-1})
  }
  submitForm(){
    this.setState({processing:true});
    const name = this.refs.name.value;
    const cost = this.refs.cost.value;
    const description = this.refs.description.value;
    const idProduct = this.state.product._id;
    var sizes = [];
    var countProduct=0;
    for (var i=1; i<=this.state.curSizes; i++){
      const strSize = this.refs["size"+i].value;
      const strColor = this.refs["color"+i].value;
      var size = {};
      size.size = parseInt(strSize);
      var colors = [];
      const arrColorQuanty = strColor.split(",");
      arrColorQuanty.forEach(element => {
           var ColorQuanty = element.split(":");
           var color = {
             color:ColorQuanty[0],
             quanty:parseInt(ColorQuanty[1])
           }
           countProduct += color.quanty;
           colors.push(color);
      });
      size.colors = colors;
      sizes.push(size);
    }
    var image = {
      image1: this.state.image1,
      image2: this.state.image2,
      image3: this.state.image3
    }
    var that = this;
    $.post("/updateProduct", {
      id: idProduct, name: name, cost: cost, oldcost: JSON.stringify(that.state.product.costs),
      description: description, sizes: JSON.stringify(sizes), image: JSON.stringify(image), quanty:countProduct
    }, function (data) {
      that.setState({processing:false});
      if (data.success == 1) {
        main.setState({ listProduct: data.lProduct });
        that.setState({ updateSuccess: 1 });
      }
    })
  }
  handleImage(image){
    let imageFormObj = new FormData();
    imageFormObj.append("imageName","multer-image"+Date.now());
    imageFormObj.append("imageData",image);
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "POST",
            url: "/upload",
            data: imageFormObj,
            processData: false,
            contentType: false,
            success: function (data) {
                return (resolve("/img/product/"+data));
            },
            fail: function(err) {
                return (reject(new Error(err)));
            }
        })
    })
}
  ChangeImage1(e) {
    var that = this;
    image1 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image1 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image1).then(res => that.setState({ image1: res }), err => console.log(err));
      }
    })
  }
  ChangeImage2(e) {
    var that = this;
    image2 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image2 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image2).then(res => that.setState({ image2: res }), err => console.log(err));
      }
    })
  }
  ChangeImage3(e) {
    var that = this;
    image3 = e.target.files[0];
    $.post("/deleteImage", { path: that.state.image3 }, function (data) {
      console.log(data);
      if (data == 1) {
        that.handleImage(image3).then(res => that.setState({ image3: res }), err => console.log(err));
      }
    })
  }
  render(){
    var arrHtmlSizes= new Array();
    if (this.state.product != "") {
      var arrSizes = [];
      arrSizes = this.state.product.sizes;
      for (var i = 1; i <= arrSizes.length; i++) {
        if (i>this.state.curSizes) break;
        var strColorQuanty="";
        arrSizes[i-1].colors.forEach(color => {
          strColorQuanty+=color.color+":"+color.quanty+",";
        });  
        strColorQuanty = strColorQuanty.slice(0,-1);
        var htmlSize = (<div className="row">
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
            <label>Size:</label>
            <input type="text" className="form-control" placeholder="Enter size" ref={"size" + i} defaultValue={arrSizes[i - 1].size} required/>
          </div>
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <label>Color:Quantity</label>
            <input type="text" className="form-control"  placeholder="color1:quanty1,color2:quanty2,..." 
            ref={"color" + i} defaultValue={strColorQuanty} required/>
          </div>
          <br />
        </div>);
        arrHtmlSizes.push(htmlSize);
      }
      for (var i=arrSizes.length+1; i<=this.state.curSizes; i++){
        var htmlSize = (<div className="row">
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
            <label>Size:</label>
            <input type="text" className="form-control" placeholder="Enter size" ref={"size" + i} required/>
          </div>
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <label>Color:Quantity</label>
            <input type="text" className="form-control"  placeholder="color1:quantity1,color2:quantity2,..." ref={"color" + i} required/>
          </div>
          <br />
        </div>);
        arrHtmlSizes.push(htmlSize);
      }
      var notifyUpdateSuccess = <div></div>
    if (this.state.updateSuccess==1){
    notifyUpdateSuccess = 
      <div class="alert alert-success">
        <strong>Update Product Successfully!</strong>
      </div>
    }
    console.log(this.state.product.costs);
    }
    return(<div className="modal fade right " id="modalUpdateProduct" role="dialog" aria-labelledby="myModalLabel"
    aria-hidden="true">
    <div className="modal-dialog modal-full-height modal-right modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title w-100 text-center" id="myModalLabel">UPDATE PRODUCT</h4>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <div className="form-group" key={this.state.product._id}>
                <label>Product Name:</label>
                <input type="text" className="form-control" placeholder="Enter name" ref="name" defaultValue={this.state.product.name} required/>
              </div>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <div className="form-group" key={this.state.product._id}>
                <label>Cost(VND):</label>
                <input type="text" className="form-control" placeholder="Enter cost" ref="cost" defaultValue={this.state.curcost} required/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"  key={this.state.product._id} >
              <label>Description:</label> <br />
              <textarea rows="5" style={{ width: "100%" }} ref="description" defaultValue={this.state.product.description}></textarea>
            </div>
          </div>
          <div key={this.state.product._id}>
          {arrHtmlSizes}
          </div>     
          <div className="row" style={{ marginTop: "10px" }}>
            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              <button className="btn btn-success addsize" onClick={this.AddSize}>Add size</button>
              <button className="btn btn-danger removesize" onClick={this.RemoveSize}>Remove size</button>
            </div>
          </div>
          <div className="row" style={{ marginTop: "10px" }}>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image1} width="100%"/>
                  <label>Image 1:</label>
                  <input type="file" className="form-control" ref="image1" onChange={(e) => this.ChangeImage1(e)} required />
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image2} width="100%"/>
                  <label>Image 2:</label>
                  <input type="file" className="form-control" ref="image2" onChange={(e) => this.ChangeImage2(e)} />
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <img src={this.state.image3} width="100%"/>
                  <label>Image 3:</label>
                  <input type="file" className="form-control" ref="image3" onChange={(e) => this.ChangeImage3(e)} />
                </div>
            </div>
          </div>
            <div className="row" style={{ marginTop: "10px" }}>
              {notifyUpdateSuccess}
            </div>
        </div>
        <div className="modal-footer justify-content-center">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" className="btn btn-danger" type="submit" onClick={this.submitForm}>Save</button>
        </div>
        {this.state.processing==true ? <div class="loader text-center"></div> : ""}
      </div>
    </div>
  </div>)
  }
}
class ManageProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listProduct: [],
      curpage: 1,
      permission: false,
      addExcel:-1
    }
    this.handleChange = this.handleChange.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.readFile = this.readFile.bind(this);
    main = this;
  }
  componentWillMount(){
    var that = this;
    const token = localStorage.getItem('tokenad');
    if (!token) {
      this.setState({ permission: false })
    }
    $.get("/admin", { token: token }, function (data) {
      if (data.success == 0) {
        localStorage.removeItem('emailad');
        localStorage.removeItem('usernamead');
        that.setState({ permission: false })
      } else {
        that.setState({ permission: true })
      }
    })
  }
  componentDidMount() {
    var that = this;
    $.get("/getAllProducts", function (data) {
      that.setState({ listProduct: data });
    });
    socket.on("update-quantity-product",function(data){
      $.get("/getAllProducts", function(dataProduct) {
        that.setState({ listProduct: dataProduct });
      });
    })
  }
  changePage(value, event) {
    this.setState({ curpage: value });
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
  handleChange(event){
    var that = this;
      $.post("/searchproduct",{keysearch:event.target.value},function(data){
        that.setState({listProduct:data});
      })
  }
  readFile(file) {
    var that = this;
    const input = document.getElementById('input');
    this.setState({ addExcel: -1 });
    readXlsxFile(input.files[0]).then((rows) => {
      $.post("/importProduct", { data: JSON.stringify(rows) }, function (data) {
        if (data == 0) {
          that.setState({ addExcel: 0 })
        } else {
          that.setState({ listProduct: data.lProduct, addExcel: 1 })
        }
      })
    })
  }
  render() {
    var lCurProduct = [];
    var page = "";
    if (this.state.listProduct.length != 0) {
      page = [];
      var perpage = 5;
      var start = (this.state.curpage - 1) * perpage;
      var finish = start+perpage;
      if (finish>this.state.listProduct.length) finish=this.state.listProduct.length;
      lCurProduct = this.state.listProduct.slice(start, finish);
      var numberpage = Math.ceil(this.state.listProduct.length / perpage);
      for (var i = 1; i <= numberpage; i++) {
        if (this.state.curpage == i) {
          page.push(<li class='active'><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }} >{i}</a></li>);
        } else {
          page.push(<li><a onClick={this.changePage.bind(this, i)} style={{ cursor: 'pointer' }}>{i}</a></li>)
        }
      }
    }
    var notify = "";
      if (this.state.addExcel == 1)   {
        notify = <div class="alert alert-success" style={{marginTop:'10px'}}>
        <strong>Import Users Successfully!</strong>
      </div> 
      } else if (this.state.addExcel==0){
        notify = <div class="alert alert-danger" style={{marginTop:'10px'}}>
        <strong>An error has occurred!</strong></div>
      }
    return (<div id='content'>
      <div class='panel panel-default grid'>
        <div class='panel-heading'>
          <i class='icon-table icon-large'></i>
          Manage Products
            <div class='panel-tools'>
            <div class='btn-group'>
            </div>
            {/* <div class='badge'>3 record</div> */}
          </div>
        </div>
        {this.state.permission==false ? 
                <div className="text-center notification">
                  <br />
                  <h3>Not permitted. Please access the following link to login!</h3>
                  <button className="btn btn-primary" onClick={() => window.location.replace("/login")} style={{ marginTop: '10px', width: 'auto' }}>Đi đến trang đăng nhập</button>
                </div> :
        <div>
        <div class='panel-body filters'>
          <div class="row">
            <h3 class="text-center"><b>LIST PRODUCTS</b></h3>
          </div>
          <div class='row'>
            <div class='col-md-9'>
            </div>
            <div class='col-md-3'>
              <div class='input-group'>
                <input class='form-control' placeholder='Search product' type='text' onChange={this.handleChange}/>
                <span class='input-group-btn'>
                  <button class='btn' type='button'>
                    <i class='icon-search'></i>
                  </button>
                </span>
              </div>
            </div>
            {/* <div class="text-right" style={{ marginTop: '50px', paddingRight: '10%' }}>
              <button class="btn btn-warning" data-toggle="modal" data-target="#modalNewProduct">
                <i class="icon-plus-sign"></i>Add New Product
                </button>
            </div> */}
          </div>
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 btnAddUser text-right">
                  <button class="btn btnNewSomething" data-toggle="modal" data-target="#modalNewProduct">
                    <i class="icon-plus-sign"></i> Add New Product
                      </button>
                  <div class="upload-btn-wrapper">
                    <button class="btnUpload" >Import an Excel File</button>
                    <input type="file" name="myfile" onChange={this.readFile} id="input" />
                  </div>
                </div>
              </div>
              {notify}
        </div>
        <table class='table'>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Name</th>
              <th class="text-center">Image</th>
              <th class="text-center">Cost</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Sizes</th>
              <th class="text-center">Description</th>
              <th class='actions'>
                Actions
                </th>
            </tr>
          </thead>
          <tbody>
            {lCurProduct.map(function (pro, index) {
              return <Products key={index} stt={start + (index + 1)} product={pro} />
            })}
          </tbody>
        </table>
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
      </div>}
      </div>
      <NewProduct />
      <UpdateProduct/>
      <Comments/>
    </div>)
  }
}

ReactDOM.render(
  <div>
    <Navbar />
    <div id="wrapper">
      <Sidebar active={4}/>
      <Tool curpage="Manage Products"/>
      <ManageProducts />
    </div>
  </div>, document.getElementById("manage-products")
)