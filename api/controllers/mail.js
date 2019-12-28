const nodemailer = require("nodemailer");
function SendMail(receiver,subject,contentMail){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'nguyengiau.9801@gmail.com',
               pass: '26419982641998'
           }
       });
    
    const mailOptions = {
        from: 'nguyengiau.9801@gmail.com', // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        html: contentMail// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            console.log(err);
        }
     });
}
module.exports = SendMail;

   