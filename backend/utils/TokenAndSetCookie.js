const jwt = require('jsonwebtoken');

const TokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

const loginToken = (res, userId) => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  res.cookie('user', token, {
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax', 
    path: '/',
  });
  
  return token;
  
};

module.exports = { TokenAndSetCookie , loginToken };
