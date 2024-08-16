const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { TokenAndSetCookie } = require('../utils/TokenAndSetCookie');

const prisma = new PrismaClient();

const singUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const userData = {
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires: Date.now() + 86400000 
        };
        const user = await prisma.user.create({ data: userData });

        TokenAndSetCookie(res, user.id);
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user,
                password: undefined
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { singUp };
