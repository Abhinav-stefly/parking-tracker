const nodemailer = require('nodemailer');

const sendEmail = async (mailData) =>{
  const {subject, receiverMail} = mailData
;

const transporter = nodemailer.createTransport({
  host : smtp.gmail.com,
  port : 587,
  secure : false,
  auth : {
    user : process.env.ADMIN_EMAIL,
    pass :process.env.ADMIN_PASSWORD,
  },
  tls :{
    rejectUnauthorized : false,
  }
})

var mailOptions ;
if(mailData.html){
  mailOptions = {
    from : process.env.ADMIN_EMAIL,
    to : receiverMail,
    subject : subject,
    html : mailData.html,
  };
}
else {
  mailOptions = {
    from : process.env.ADMIN_EMAIL,
    to : receiverMail,
    subject : subject,
    text : mailData.body,
  };
}

try {
  await transporter.sendMail(mailOptions);
  console.log('Mail sent');
}
catch (err){
  console.log(err);
}
}