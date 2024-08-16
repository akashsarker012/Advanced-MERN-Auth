const express = require('express');
const { singUp } = require('../../controller/authController');
const router = express.Router();

router.post('/singup', singUp);

module.exports = router;