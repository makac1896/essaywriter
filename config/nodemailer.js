const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  }
//   logger: false
});

async function sendEmail(subject="Essay Review Request | HIS Alumni", message=`<b>Hey Awesome Mentor</b>
<br/>
<p>Daniel has asked you to review their essay at 8:44 PM Thursday 13, July</p>`, toEmail="makac1896@gmail.com") {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"HIS Merit Scholarship Alumni " <hisalumni@yahoo.com>',
    to: "makac1896@gmail.com,"+toEmail,
    subject,
    text: "Hello world?",
    html: message,
  });

  console.log("Message sent: %s", info.messageId);
}

// sendEmail().catch(console.error);

module.exports = {
  sendEmail,
};

// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_EMAIL,
//     pass: process.env.GMAIL_PASSWORD
//   }
// });

// const mailOptions = {
//   from: 'hello@example.com',
//   to: 'reciever@gmail.com',
//   subject: 'Subject',
//   text: 'Email content'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//  console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//     // do something useful
//   }
// });
