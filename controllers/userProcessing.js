// глобальні імпорти
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // бібліотека для хешування 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fs = require('fs/promises')
const path = require('path')
const gravatar = require('gravatar') //аватар заглушка
 const jimp = require('jimp');
// локальні імпорти
const { HttpError } = require('../helpers'); // обробка помилок
const User = require('../models/User');
const upload = require('../middlewares/upload');

const JWT_SECRET = process.env.JWT_SECRET;

const avatarsPath = path.resolve("pablic", "avatars")
 
const addSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
  });

const register = async (req, res, next) => {
    try {
      const { email, password } = req.body;

       // Перевірка на відсутність обох полів email та password
        if (!email || !password) {
          throw new HttpError(400, 'Потрібно заповнити всі поля');
        }
        // Валідація паролю та електронної адреси
        const { error } = addSchema.validate(req.body, { abortEarly: false });
    
        if (error) {
          const errorMessage = error.details.map((err) => err.message).join('; ');
          throw new HttpError(400, errorMessage);
        }

    // Перевірка наявності електронної адреси в БД
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Такий email вже використовується' });
    }

    // Хешування паролю
      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarURL = gravatar.url(email)

    // Створення нового користувача
    const user = new User({
      email,
      password: hashedPassword,
      subscription: 'starter',
      avatar: avatarURL
    });

    await user.save();
    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).json({ message: 'Вам потрібно заповнити усі поля' });
  }
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Помилка при порівнянні паролів' });
        } else {
          if (result) {
            const payload = {userId: user._id}
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn:"23h"})
            // updateTokenStatus(user._id, {token})
            const responseData = {
              token,
              user: {
                email: user.email,
                subscription: user.subscription
              }
            }
            return res.status(200).json(responseData)
          } else {
            return res.status(400).json({ message: 'Паролі не співпадають' });
          }
        }
      });
    } else {
      return res.status(409).json({ message: 'Такого користувача не знайдено' });
    }
  } catch (err) {
    return res.status(500).json({ message: `Помилка під час пошуку користувача: ${err}` });
  }
};

 
const logout = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Не авторизовано' });
    }

    user.token = null;
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};



const corentUserData = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Не авторизовано' });
    }

    const userData = {
      email: user.email,
      subscription: user.subscription
    };

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const resultUpload = path.join(avatarsPath, originalname);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", originalname);

    // Обробка аватару за допомогою jimp
    const jimpImage = await jimp.read(resultUpload);
    await jimpImage.resize(250, 250).write(resultUpload);

    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: avatarURL },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  corentUserData,
  updateAvatar,
};

