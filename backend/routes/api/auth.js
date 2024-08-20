const express = require('express');
const { singUp, verifyEmail } = require('../../controller/authController');
const router = express.Router();

router.post('/singup', singUp);
router.post('/verify-email', verifyEmail);


module.exports = router;