const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secureConnection: false,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(emailOptions);
};

module.exports = sendEmail;
