module.exports = function(app,io){
    io.on("connection", function(socket) {
        socket.on("require-update-view-product",(data)=>{
            io.sockets.emit("update-view-product","");
        });
        socket.on("require-update-order-product",(data)=>{
            io.sockets.emit("update-order-product","");
        })
    })
}