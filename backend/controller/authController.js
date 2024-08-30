const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { TokenAndSetCookie, loginToken } = require("../utils/TokenAndSetCookie");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email");
const { error } = require("console");
const prisma = new PrismaClient();
const singUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({success: false, message: "User already exists" });
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
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const user = await prisma.user.create({ data: userData });
    sendVerificationEmail(user.email, verificationToken);
    TokenAndSetCookie(res, user.id);

    res.status(200).json({
      success: true,
      message: "User created successfully Please verify your email",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

    const userId = decode.userId

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "No user ID found in cookies",
      });
    }

    const { verificationToken } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationToken !== verificationToken) {
      return res.status(400).send({
        success: false,
        message: "Invalid verification code",
      });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: "", 
        verificationExpires: null, 
      },
    });
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const singIn = async (req, res) => {
  const deviceInfo = req.deviceInfo;
  const ip = req.clientIp;
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ error: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ error: 'Incorrect password' });
    }
    if(user.isVerified === false){
      return res.json({ error: "Please verify you email" });
    }
    const uniqueToken = Date.now().toString();

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ip: ip,
        userAgent: uniqueToken,
        token: uniqueToken,
        deviceInfo: deviceInfo,
      },
    });

    loginToken(res, user.id);
    user.lastLoginAt = new Date();

    res.json({ success: "Logged in successfully",});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      },
    });
    await sendResetPasswordEmail(
      user.email,
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    );
    res
      .status(200)
      .json({ success: true, message: "Reset password email sent" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
};
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
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
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  singUp,
  verifyEmail,
  singIn,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
};
