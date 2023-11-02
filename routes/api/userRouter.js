const express = require('express');
const controller = require('../../controllers')
const checkToken = require('../../middlewares/authMiddleware')
const upload = require('../../middlewares/upload')

const router = express.Router();

// дії з користувачами
router.post('/register', upload.single("avatars"), controller.userRegister); // Оновлено шлях до реєстрації
router.post('/login', controller.userLogin)//
router.post('/logout', checkToken, controller.userLogout);
router.post('/current', checkToken, controller.corentUserData);




module.exports = router;