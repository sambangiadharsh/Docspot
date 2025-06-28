const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,     // your email
      pass: process.env.EMAIL_PASS      // app password
    }
  });

  const mailOptions = {
    from: `"DocSpot" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
