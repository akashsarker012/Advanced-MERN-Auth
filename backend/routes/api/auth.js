const express = require('express');
const { singUp, verifyEmail, singIn } = require('../../controller/authController');
const router = express.Router();

router.post('/singup', singUp);
router.post('/verify-email', verifyEmail);
router.post('/singin', singIn);


module.exports = router;