const nodemailer = require("nodemailer");
function SendMail(receiver,subject,contentMail,callback){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'shoelg98@gmail.com',
               pass: 'shopgiayonline'
           }
       });
    
    const mailOptions = {
        from: 'shoelg98@gmail.com', // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        html: contentMail// plain text body,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            callback(err,null);
        } else {
            callback(null,info);
        }
     });
}
module.exports = SendMail;

   