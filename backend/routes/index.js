const express = require('express');
const router = express.Router();
const authRoute = require('./api/auth');

const privateApi = process.env.PRIVATE_API; 
console.log(privateApi);
router.use(privateApi, authRoute );

module.exports = router;