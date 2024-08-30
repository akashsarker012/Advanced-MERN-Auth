const express = require('express');
const { singUp, verifyEmail, singIn, forgotPassword, resetPassword, checkAuth, logout } = require('../../controller/authController');
const verifyToken = require('../../middleware/verifyToken');
const deviceInformation = require('../../middleware/deviceInformation');

const router = express.Router();

router.get('/check-auth', verifyToken , checkAuth);
router.post('/singup', singUp);
// router.get('/get-cookies', (req, res) => {
//     res.send(req.cookies);
// });
router.post('/verify-email', verifyEmail);
router.post('/singin',deviceInformation, singIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token' , resetPassword);
router.post('/logout' , logout);

module.exports = router;