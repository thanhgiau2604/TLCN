module.exports = function(app,io){
    io.on("connection", function(socket) {
        socket.on("require-update-view-product",(data)=>{
            io.sockets.emit("update-view-product","");
        });
        socket.on("require-update-order-product",(data)=>{
            io.sockets.emit("update-order-product","");
        });
        socket.on("require-update-quantity-product",(data)=>{
            io.sockets.emit("update-quantity-product","");
        })
    });
    var x = 270000;
    x = x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    console.log(x.substr(1,x.length-1));
}