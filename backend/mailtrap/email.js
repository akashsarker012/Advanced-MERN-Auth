const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplete");
const { mailClient, sender } = require("./mailtrap.config");

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: sender.email, // Sender address
    to: email,          // Recipient's email
    subject: "Verify Your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // HTML template
  };

  try {
    const response = await mailClient.sendMail(mailOptions); 
    console.log("Email sent: ", response);
  } catch (error) {
    console.log("Error sending email: ", error.message);
  }
};

module.exports = { sendVerificationEmail };
