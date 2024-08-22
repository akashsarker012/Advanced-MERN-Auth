const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { TokenAndSetCookie } = require("../utils/TokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } = require("../mailtrap/email");
const prisma = new PrismaClient();
const singUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const userData = {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      lastLoginAt: new Date(),
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };

    const user = await prisma.user.create({ data: userData });
    sendVerificationEmail(user.email, verificationToken);
    TokenAndSetCookie(res, user.id);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: req.body.verificationToken,
        verificationExpires: { gte: new Date() },
      },
    });

    // If no user is found, return an error
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
    }

    // Update the user's verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: '', // Set to empty string
        verificationExpires: null, // Set to null
      },
    });

    // Respond with success
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    // Handle any errors
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};


const singIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    TokenAndSetCookie(res, user.id);
    user.lastLoginAt = new Date();


    res.status(200).json({ success: true, message: "Logged in successfully", user: {
      ...user,
      password: undefined,
    } });
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: error.message });
    
  }

}

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); 
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: resetTokenExpires },
    });
    await sendResetPasswordEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);
    res.status(200).json({ success: true, message: "Reset password email sent" });
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: error.message });
    
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Send success email
    await sendResetSuccessEmail(user.email, user.name);
    res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { singUp , verifyEmail , singIn , logout,forgotPassword , resetPassword };
