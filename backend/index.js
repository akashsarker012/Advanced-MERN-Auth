const { PrismaClient } = require('@prisma/client');
const express = require('express');
const { connectDatabase } = require('./database/connectDb');
require('dotenv').config();
const apiRoutes = require('./routes/index');
const app = express();
const port = 5000;
connectDatabase()

app.use(express.json());
app.use(apiRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
