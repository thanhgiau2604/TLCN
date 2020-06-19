var x,y,z,t;
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
        socket.on("run-sale",(data)=>{
            const name = data.name;
            const end = data.end;
            const idSale = data.idSale;
            console.log(data);
            const dataSend = {
                end:end,
                idSale : idSale
            }
            if (name=="Kid Product"){
                setTimeout(function(){
                    io.sockets.emit("sale-kid-product",dataSend);
                },2000)
            } else if (name=="Pump Product"){
                setTimeout(function(){
                    io.sockets.emit("sale-pump-product",dataSend);
                },2000)
            } else if (name=="Sport Product"){
                setTimeout(function(){
                    io.sockets.emit("sale-sport-product",dataSend);
                },2000)
            } else if (name=="Sneaker Product"){
                setTimeout(function(){
                    io.sockets.emit("sale-sneaker-product",dataSend);
                },2000)
            } 
        })
        socket.on("run-time-pump",(data)=>{
            var end = data.end;
            var now = new Date().getTime();
            var distance = end - now+1;
            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
            y = setInterval(function(){
                if (distance-1000<=0) {
                    io.sockets.emit("stop-sale-pump",data.idSale);
                    clearInterval(y);
                }
                distance -= 1000;
                var objDateTime= {
                    ngay : Math.floor(distance/day),
                    gio : Math.floor((distance%day)/hour),
                    phut : Math.floor((distance%hour)/minute),
                    giay : Math.floor((distance%minute)/second)
                 }
                 if (objDateTime.ngay<10) objDateTime.ngay = '0'+objDateTime.ngay;
                 if (objDateTime.gio<10) objDateTime.gio = '0'+objDateTime.gio;
                 if (objDateTime.phut<10) objDateTime.phut = '0'+objDateTime.phut;
                 if (objDateTime.giay<10) objDateTime.giay = '0'+objDateTime.giay;
                io.sockets.emit("running-time-pump",objDateTime);
            },1000)
        }) 
        socket.on("run-time-kid",(data)=>{
            var end = data.end;
            var now = new Date().getTime();
            var distance = end - now+1;
            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
            console.log(distance);
            x = setInterval(function(){
                if (distance-1000<=0) {
                    io.sockets.emit("stop-sale-kid",data.idSale);
                    clearInterval(x);
                }
                distance -= 1000;
                var objDateTime= {
                    ngay : Math.floor(distance/day),
                    gio : Math.floor((distance%day)/hour),
                    phut : Math.floor((distance%hour)/minute),
                    giay : Math.floor((distance%minute)/second)
                 }
                 if (objDateTime.ngay<10) objDateTime.ngay = '0'+objDateTime.ngay;
                 if (objDateTime.gio<10) objDateTime.gio = '0'+objDateTime.gio;
                 if (objDateTime.phut<10) objDateTime.phut = '0'+objDateTime.phut;
                 if (objDateTime.giay<10) objDateTime.giay = '0'+objDateTime.giay;
                io.sockets.emit("running-time-kid",objDateTime);
            },1000)
        }) 
        socket.on("run-time-sport",(data)=>{
            var end = data.end;
            var now = new Date().getTime();
            var distance = end - now+1;
            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
            console.log(distance);
            z = setInterval(function(){
                if (distance-1000<=0) {
                    io.sockets.emit("stop-sale-sport",data.idSale);
                    clearInterval(z);
                }
                distance -= 1000;
                var objDateTime= {
                    ngay : Math.floor(distance/day),
                    gio : Math.floor((distance%day)/hour),
                    phut : Math.floor((distance%hour)/minute),
                    giay : Math.floor((distance%minute)/second)
                 }
                 if (objDateTime.ngay<10) objDateTime.ngay = '0'+objDateTime.ngay;
                 if (objDateTime.gio<10) objDateTime.gio = '0'+objDateTime.gio;
                 if (objDateTime.phut<10) objDateTime.phut = '0'+objDateTime.phut;
                 if (objDateTime.giay<10) objDateTime.giay = '0'+objDateTime.giay;
                io.sockets.emit("running-time-sport",objDateTime);
            },1000)
        }) 
        socket.on("run-time-sneaker",(data)=>{
            var end = data.end;
            var now = new Date().getTime();
            var distance = end - now+1;
            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
            console.log(distance);
            t = setInterval(function(){
                if (distance-1000<=0) {
                    io.sockets.emit("stop-sale-sneaker",data.idSale);
                    clearInterval(t);
                }
                distance -= 1000;
                var objDateTime= {
                    ngay : Math.floor(distance/day),
                    gio : Math.floor((distance%day)/hour),
                    phut : Math.floor((distance%hour)/minute),
                    giay : Math.floor((distance%minute)/second)
                 }
                 if (objDateTime.ngay<10) objDateTime.ngay = '0'+objDateTime.ngay;
                 if (objDateTime.gio<10) objDateTime.gio = '0'+objDateTime.gio;
                 if (objDateTime.phut<10) objDateTime.phut = '0'+objDateTime.phut;
                 if (objDateTime.giay<10) objDateTime.giay = '0'+objDateTime.giay;
                io.sockets.emit("running-time-sneaker",objDateTime);
            },1000)
        }) 
        socket.on("require-stop-sale",function(data){
            var idSale = data.idSale;
            var nameCategory = data.nameCategory;
            switch (nameCategory) {
              case "Kid Product":
                  clearInterval(x);
                  io.sockets.emit("stop-sale-kid",idSale);
                break;
              case "Pump Product":
                clearInterval(y);
                io.sockets.emit("stop-sale-pump",idSale);
                break;
              case "Sport Product":
                clearInterval(z);
                io.sockets.emit("stop-sale-sport",idSale);
                break;
              case "Sneaker Product":
                clearInterval(t);
                io.sockets.emit("stop-sale-sneaker",idSale);
                break;
            }
        })
    });
}