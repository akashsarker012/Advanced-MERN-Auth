const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplete");
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

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: sender.email, // Sender address
    to: email,          // Recipient's email
    subject: "Welcome to My App",
    html: `Welcome ${name}!`, // HTML template
  };

  try {
    const response = await mailClient.sendMail(mailOptions);
    console.log("Email sent: ", response);
  } catch (error) {
    console.log("Error sending email: ", error.message);
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {

  try {

    const mailOptions = {
      from: sender.email,
      to: email,          
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetToken}", resetToken),
    };

    try {
      const response = await mailClient.sendMail(mailOptions);
      console.log("Email sent: ", response);
    } catch (error) {
      console.log("Error sending email: ", error.message);
    }
    
  } catch (error) {
    console.log("Error sending email: ", error.message);
    
  }


}

const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: sender.email,
    to: email,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const response = await mailClient.sendMail(mailOptions);
    console.log("Email sent: ", response);
  } catch (error) {
    console.log("Error sending email: ", error.message);
  }
  };


module.exports = { sendVerificationEmail, sendWelcomeEmail , sendResetPasswordEmail, sendResetSuccessEmail };
