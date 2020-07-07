import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import 'bootstrap/js/dist/modal'
import 'bootstrap/js/dist/tab'
import QRCode from 'qrcode'

const qrCanvas = document.querySelector('#qrcode');
const $qrContainer = $('#qrcontainer');
const $amount = $('#amount');
const $description = $('#description');
const $paymentCode = $('#paymentcode');
const $bankcode = $('#bankcode');
const $web2appLink = $('#web2app-link');

class ZaloHome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listBank: [],
            methodPay: 1,
            showQR: 0,
            web2appLink: "#",
            amount: 0
            
        }
        this.showQR = this.showQR.bind(this);
        this.hideQR = this.hideQR.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
        this.payment = this.payment.bind(this);
        this.listenCallback = this.listenCallback.bind(this);
    }
    componentDidMount(){
        var that = this;
        var params = new URLSearchParams(window.location.search);
        var amount= parseInt(params.get("amount"));
        this.setState({amount:amount});
        $.get("/zalo/getbanklist",function(data){
            if (data.returncode == 1) {
                const bankList = [];
                const banks = data.banks;
                for (const id in banks) {
                    const banklistOfId = banks[id];
                    for (const bank of banklistOfId) {
                        bankList.push(bank);
                    }
                }
                that.setState({listBank:bankList});
            } else {
                alert("Không lấy được danh sách ngân hàng");
            }
        })
    }
    chooseBank(e){
        console.log(e.target.value);
    }
    showQR(text){
        var that = this;
        QRCode.toCanvas(document.getElementById("qrcode"), text,function(err){
            if (err) console.log(err);else 
            that.setState({showQR:1});
        });  
    }
    hideQR() {
        this.setState({showQR:0});
    }
    showLoading() {
        $('#loading').css('display', 'flex');
    }
    hideLoading() {
        $('#loading').css('display', 'none');
    }
    qrpay(){
        this.setState({methodPay:1})
    }
    gateway(){
        this.setState({methodPay:2})
    }
    quickpay(){
        this.setState({methodPay:3})
    }
    listenCallback(apptransid, cb) {
        const ws = new WebSocket('ws://localhost:3000/subscribe' + "?apptransid=" + apptransid);
        ws.onopen = e => {
          console.log('open ws', apptransid);
        };
        ws.onmessage = e => {
          const data = JSON.parse(e.data);
          console.log('ws message', data);
          cb(data);
          alert('Thanh toán thành công');
        };
        ws.onclose = e => {
          console.log('close ws', apptransid);
        };
    }
    payment(e){
        e.preventDefault();
        var order = {
            description : this.refs.description.value,
            amount : this.refs.amount.value
        }
        var that = this;
        if (this.state.methodPay==1){
            $.post("/zalo/createorder?ordertype=createorder",{order:JSON.stringify(order)},function(res){
                that.showQR(res.orderurl);
                that.setState({web2appLink:res.orderurl});
                that.listenCallback(res.apptransid, hideQR);
            })
        } else
        if (this.state.methodPay==2){
            order.bankcode = this.refs.chooseBank.value;
            console.log(order.bankcode);
            $.post("/zalo/createorder?ordertype=gateway",{order:JSON.stringify(order)},function(res){
                console.log(res);
                window.open(res);
            })
        } else 
        if (this.state.methodPay==3){
            if (this.refs.paymentcode.value.toString().trim().length == 0) {
                alert('Mã thanh toán là bắt buộc');
              } else {
                order.paymentcodeRaw = this.refs.paymentcode.value;
                $.post("/zalo/createorder?ordertype=quickpay",{order:JSON.stringify(order)},function(res){
                    that.showLoading();
                    that.listenCallback(res.apptransid,that.hideLoading);
                })
            }
        }
    }
    render(){
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-white">
                    <a class="navbar-brand" href="/">
                        <img src="img/logo-zalopay.svg" alt="Logo ZaloPay" />
                    </a>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-link text-primary" href="/">Trang chủ</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/history.html">Lịch sử</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <form id="myForm" class="container mt-5">
                    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="qr-tab" data-toggle="tab" href="#qrpay" role="tab" aria-controls="qrpay" aria-selected="true" onClick={this.qrpay.bind(this)}>
                                QR / Mobile Web to App</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="gateway-tab" data-toggle="tab" href="#gateway" role="tab" aria-controls="gateway" aria-selected="false" onClick={this.gateway.bind(this)}>
                                Gateway</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="quickpay-tab" data-toggle="tab" href="#quickpay" role="tab" aria-controls="quickpay" aria-selected="false" onClick={this.quickpay.bind(this)}>
                                Quickpay</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="qrpay" role="tabpanel" aria-labelledby="qrpay-tab">
                            <div class="d-flex align-items-center justify-content-center">
                                <div id="qrcontainer" class={this.state.showQR==0 ? "d-none text-center" : "text-center"}>
                                    <canvas id="qrcode" class="border rounded"></canvas>
                                    <p>
                                        <a id="web2app-link" href={this.state.web2appLink}>
                                            <small>Mở link này trên mobile để test Mobile Web To App</small>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="gateway" role="tabpanel" aria-labelledby="gateway-tab">
                            <label>Thông tin thẻ test</label>
                            <ul>
                                <li><b>Số thẻ:</b> 4111111111111111</li>
                                <li><b>Tên:</b> NGUYEN VAN A</li>
                                <li><b>Ngày hết hạn:</b> 01/21</li>
                                <li><b>Mã CVV:</b> 123</li>
                            </ul>
                            <div class="form-group">
                                <label for="bankcode">Ngân hàng</label>
                                <select id="bankcode" class="form-control" ref="chooseBank"
                                onChange={this.chooseBank.bind(this)}>
                                    <option value="" name="bank">Không chọn</option>
                                    {this.state.listBank.map(function(bank,index){
                                        return(<option value={bank.bankcode} name="bank">{bank.name}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="quickpay" role="tabpanel" aria-labelledby="quickpay-tab">
                            <p id="loading" class="align-items-center mb-4" style={{display: "none"}}>
                                <span class="spinner-border text-primary" role="status"></span>
                                <b class="text-primary ml-2">Đang xử lý...</b>
                            </p>
                            <div class="form-group">
                                <label for="paymentcode">Mã thanh toán <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="paymentcode" placeholder="Nhập mã thanh toán" ref="paymentcode"/>
                                <small class="text-muted">Bạn có thể quét mã thanh toán <a href="https://mep.zpapps.vn/docs/quickpay/demo.html" target="_blank">ở đây</a>
            (Click <img src="/img/scanicon.png" width="60" /> ở trường "Mã thanh toán")</small>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description">Mô tả</label>
                        <textarea type="text" class="form-control" id="description" placeholder="Nhập mô tả" ref="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Số tiền <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="amount" placeholder="Nhập số tiền" value={this.state.amount} ref="amount"/>
                    </div>
                    <button class="btn btn-primary" onClick={this.payment}>Thanh toán</button>
                </form>
            </div>
        );
    }
}
ReactDOM.render(<ZaloHome/>,document.getElementById("zalohome"));