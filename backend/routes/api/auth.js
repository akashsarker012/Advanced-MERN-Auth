const express = require('express');
const { singUp, verifyEmail, singIn, forgotPassword, resetPassword } = require('../../controller/authController');
const router = express.Router();

router.post('/singup', singUp);
router.post('/verify-email', verifyEmail);
router.post('/singin', singIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token' , resetPassword);


module.exports = router;