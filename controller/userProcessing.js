// глобальні імпорти
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // бібліотека для хешування 
// локальні імпорти
const { HttpError } = require('../helpers'); // обробка помилок
const User = require('../models/User');

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(4).required().messages({
      'string.min': 'Password should have at least {#limit} characters',
      'any.required': 'Password is required'
    })
  });
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Валідація паролю та електронної адреси
        const { error } = addSchema.validate(req.body, { abortEarly: false });
    
        if (error) {
          const errorMessage = error.details.map((err) => err.message).join('; ');
          throw new HttpError(400, errorMessage);
        }

    // Перевірка наявності електронної адреси в БД
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const user = new User({
      email,
      password: hashedPassword,
      subscription: 'starter'
    });

    await user.save();
    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    user.token = null;
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

const corentUserData = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};
module.exports = {
  register,
  logout,
  corentUserData,
};
