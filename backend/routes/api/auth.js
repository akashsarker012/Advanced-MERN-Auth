const express = require('express');
const { singUp, verifyEmail, singIn, forgotPassword, resetPassword, checkAuth, logout } = require('../../controller/authController');
const verifyToken = require('../../middleware/verifyToken');

const router = express.Router();

router.get('/check-auth', verifyToken , checkAuth);
router.post('/singup', singUp);
router.post('/verify-email', verifyEmail);
router.post('/singin', singIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token' , resetPassword);
router.post('/logout' , logout);



module.exports = router;