const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database/connectDb');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const apiRoutes = require('./routes/index');
const app = express();
const port = 5000;
connectDatabase()


app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(apiRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

