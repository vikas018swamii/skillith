const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Use environment variable for email
    pass: process.env.PASS_KEY 
  },
});

const sendDeleteEmail = (toEmail, deleteToken) => {
  const mailOptions = {
    from: process.env.EMAIL, // Use environment variable for email
    to: toEmail,
    subject: "Confirm Your Account Deletion",
    text: `You requested to delete your Skillith account.\n\nClick the link below to confirm deletion:\nhttp://localhost:5173/delete-confirm/${deleteToken}\n\n⚠️ This link expires in 15 minutes. If you didn't request this, ignore the email.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending deletion email:", error);
    } else {
      console.log("Deletion confirmation email sent:", info.response);
    }
  });
};

module.exports = sendDeleteEmail;
