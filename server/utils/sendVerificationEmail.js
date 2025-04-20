// sendVerificationEmail.js
const nodemailer = require('nodemailer');


// Create the transporter using your email service provider (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail for simplicity, but you can use other services
  auth: {
    user: 'vikasswamionline@gmail.com', // Replace with your email
    pass: 'qufg dujs lbpj ygsb'  // Replace with your email password
  }
});

// Send email function
const sendVerificationEmail = (toEmail, verificationToken) => {
  const mailOptions = {
    from: 'vikasswamionline@gmail.com', // Replace with your email
    to: toEmail,                  // The user's email
    subject: 'Email Verification', // Subject line
    text: `Please verify your email by clicking the following link: 
     http://localhost:5173/verify-email?token=${verificationToken}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

module.exports = sendVerificationEmail;
