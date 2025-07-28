const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vikasswamionline@gmail.com",
    pass: "jtub upki boxx nfxf",
  },
});

const sendVerificationEmail = (toEmail, verificationToken) => {
  const mailOptions = {
    from: "vikasswamionline@gmail.com",
    to: toEmail,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: 
     https://skillith.vercel.app/verify-email?token=${verificationToken}`,
     
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Verification email sent:", info.response);
    }
  });
};

module.exports = sendVerificationEmail;
