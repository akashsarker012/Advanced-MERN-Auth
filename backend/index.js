const { PrismaClient } = require('@prisma/client');
const express = require('express');
const { connectDatabase } = require('./database/connectDb');
require('dotenv').config();
const apiRoutes = require('./routes/index');
const prisma = new PrismaClient();



const app = express();
const port = 5000;
connectDatabase()

app.use(express.json());

// app.post('/user', async (req, res) => {
//   const { name, email } = req.body;

//   try {
//     const newUser = await prisma.user.create({
//       data: { name, email },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).send('An error occurred while creating the user');
//   }
// });

app.use(apiRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
