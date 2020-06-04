var idAdmin=[];
var listUser = [];
var Chat = require("../models/chat");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
function getCurrentDayTime() {
    offset = "+7";
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var day = new Date(utc + (3600000*offset));
    var nowday = day.getDate().toString()+"-"+(day.getMonth()+1).toString()+"-"+day.getFullYear().toString()+" "
    +day.getHours().toString()+":"+day.getMinutes().toString();
    return nowday;
  }
module.exports = function (app,io) {
    app.get("/admin",(req,res)=>{
        res.render("adminpage");
    })
    app.get("/managechat",(req,res)=>{
        res.render("quanlychat");
    })
    app.post("/saveMessage",parser,(req,res)=>{
        var singleChat = {
            sender : req.body.sender,
            receiver : req.body.receiver,
            timestamp : parseInt(Date.now().toString()),
            content : req.body.content1,
            type: req.body.type,
            day: getCurrentDayTime(),
            seen: false
        }
        if (!singleChat.content) singleChat.content = req.body.content2;
        Chat.create(singleChat);
    });
    app.post("/getMessage",parser,(req,res)=>{
        var email = req.body.email;
        Chat.find({$or:[{receiver:email},{sender:email}]}).sort({timestamp:1}).exec(function(err,data){
            if (err){
                console.log(err);
            } else {
                res.send(data);
            }
        })
    })
    app.get("/getListUser",(req,res)=>{
        if (listUser.length==0){
            Chat.find({}, function (err, data) {
                if (!err && data) {
                    var arrUser = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sender != "admin") {
                            var index = arrUser.findIndex(item => item.email === data[i].sender);
                            if (index == -1) {
                                var singleUser = {
                                    email: data[i].sender,
                                    id: "123",
                                    day: data[i].day,
                                    lastmessage: data[i].content,
                                    seen: data[i].seen
                                }
                                arrUser.unshift(singleUser);
                            } else {
                                var item = arrUser[index];
                                item.day = data[i].day;
                                item.lastmessage = data[i].content;
                                item.seen = data[i].seen;
                                arrUser.splice(index,1);
                                arrUser.unshift(item);
                            }
                        } else {
                            var index = arrUser.findIndex(item => item.email === data[i].receiver);
                            if (index!=-1){
                                arrUser[index].seen = true;
                            }
                        }
                    }
                    listUser = arrUser;
                    console.log(listUser);
                    res.send(arrUser);
                }
            })
        } else {
            res.send(listUser);
        }
    })
    app.post("/updateSeenStatus",parser,(req,res)=>{
        var email = req.body.email;
        Chat.update({sender:email},{$set:{seen:true}},function(err,data){
            if (err) console.log(err);
            else res.send("Update successfully");
        })
    })
    io.on("connection", function(socket) {
        console.log("Có người kết nối: " + socket.id);
        socket.on("disconnect",() => {
            console.log(socket.id+" ngắt kết nối!");
            if (idAdmin.includes(socket.id)) {
                var index = idAdmin.indexOf(socket.id);
                idAdmin.splice(index,1);
            } else {
                // var index = listUser.findIndex(item => item.id === socket.id);
                // listUser.splice(index,1);
            }
        });
        socket.on("user-send-message",(data)=>{
            if (data.message.data.emoji || data.message.data.text.toString().trim().length>0){
                if (!idAdmin.includes(socket.id)) {
                    idUser = socket.id;
                    var singleData = {
                        email: data.email,
                        data: data.message,
                        id: socket.id
                    }
                    var index = listUser.findIndex(item => item.email === singleData.email);
                    if (index!=-1){
                        var item = listUser[index];
                        item.seen = false;
                        item.id = socket.id;
                        item.day = getCurrentDayTime();
                        item.lastmessage = data.message.data.emoji ? data.message.data.emoji : data.message.data.text;
                        listUser.splice(index, 1);
                        listUser.unshift(item);
                    } else {
                        var item = {
                            email: data.email,
                            id: socket.id,
                            day: getCurrentDayTime(),
                            lastmessage: data.message.data.emoji ? data.message.data.emoji : data.message.data.text,
                            seen: false
                        }
                        listUser.unshift(item);
                    }      
                    singleData.data.author = "them";
                    io.to(idAdmin[idAdmin.length-1]).emit("server-send-message", singleData);
                    singleData.data.author = "me";
                    socket.emit("server-send-message", singleData);
                    var dataTransfer = {
                        data: singleData,
                        listUser: listUser
                    }
                    io.to(idAdmin[idAdmin.length-1]).emit("send-listuser",dataTransfer);
                } else {
                    var singleData = {
                        email: data.email,
                        data: data.message,
                        id: socket.id
                    }
                    var index = listUser.findIndex(item => item.email === singleData.email);
                    if (index!=-1){
                        var item = listUser[index];
                        item.day = getCurrentDayTime();
                        item.seen=true;
                        item.lastmessage = data.message.data.emoji ? data.message.data.emoji : data.message.data.text;
                        listUser.splice(index, 1);
                        listUser.unshift(item);
                    }  
                    singleData.data.author = "them";
                    io.to(data.idUser).emit("server-send-message", singleData);
                    singleData.data.author = "me";
                    socket.emit("server-send-message", singleData);
                    var dataTransfer = {
                        data: singleData,
                        listUser:listUser
                    }
                    socket.emit("send-listuser",dataTransfer);
                }
            }
        });
        socket.on("require-id-admin",(data)=>{    
        })
        socket.on("require-public",(data)=>{
            idAdmin.push(socket.id);
        })
        socket.on("share-id-mine",(data)=>{
            var email = data;
            var user = {
                email: email,
                id: socket.id
            }
            io.sockets.emit("share-new-id-user",user);
            var index = listUser.findIndex(item => item.email === email);
            if (index!=-1){
                listUser[index].id = socket.id;
                io.sockets.emit("send-listuser",listUser);
            }
        });
        socket.on("change-listuser",(data)=>{
            listUser = data;
        })
    })
}