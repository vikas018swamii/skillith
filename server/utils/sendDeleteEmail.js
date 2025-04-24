const nodemailer = require('nodemailer');

// Reuse your transporter settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vikasswamionline@gmail.com',
    pass: 'qufg dujs lbpj ygsb',
  },
});

// This sends the delete confirmation email with the delete token link
const sendDeleteEmail = (toEmail, deleteToken) => {
  const mailOptions = {
    from: 'vikasswamionline@gmail.com',
    to: toEmail,
    subject: 'Confirm Your Account Deletion',
    text: `You requested to delete your Skillith account.\n\nClick the link below to confirm deletion:\nhttp://localhost:5173/delete-confirm/${deleteToken}\n\n⚠️ This link expires in 15 minutes. If you didn't request this, ignore the email.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending deletion email:', error);
    } else {
      console.log('Deletion confirmation email sent:', info.response);
    }
  });
};

module.exports = sendDeleteEmail;
