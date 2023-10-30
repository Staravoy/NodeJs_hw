const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers');
const User = require('../models/User');
const dotenv = require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ message: 'Помилка авторизації: Токен не наданий' });
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Помилковий формат токена' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Помилка верифікації токена' });
  }
};

module.exports = checkToken;
