const { Prisma } = require('@prisma/client');
var bcrypt = require('bcryptjs');
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

        const generatedVerificationCode = Math.floor(100000 + Math.random() * 900000);

        const user = await Prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        res.status(200).json({sucess: true, message: 'User created successfully', user: user});
       
    } catch (error) {
        res.status(500).json({sucess: false, message: error.message});
    }
}

module.exports = { singUp }