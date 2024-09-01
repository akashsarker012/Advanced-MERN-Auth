const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const verifyResetToken = async (req, res) => {
  // const { token } = req.query;
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASS_TOKEN);
    const { id } = decoded;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || token !== user.resetPasswordToken) {
      return res.json({ error: 'Invalid or expired token' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: 'Invalid or expired token' });
  }
};

module.exports = { verifyResetToken };
