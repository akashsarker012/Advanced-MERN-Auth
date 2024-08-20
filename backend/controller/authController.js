const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TokenAndSetCookie } = require("../utils/TokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail } = require("../mailtrap/email");
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
    // Find user with the provided token and ensure the token is still valid
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




module.exports = { singUp , verifyEmail };
