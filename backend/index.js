const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database/connectDb');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const apiRoutes = require('./routes/index');
const requestIp = require('request-ip');
const body_parser = require('body-parser')
const app = express();
const port = 5000;
connectDatabase()

app.use(express.json());
app.use(body_parser.json())
app.use(requestIp.mw())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }))
app.use(cookieParser())
app.use(apiRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

