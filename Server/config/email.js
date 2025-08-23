const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email function
const sendEmail = (to, subject, text, callback) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    replyTo: 'bachatmart@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, info);
  });
};

module.exports = sendEmail;
