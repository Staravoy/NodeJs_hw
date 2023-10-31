const express = require('express');
const checkToken = require('../../middlewares/authMiddleware')
const controller = require('../../controllers')

const router = express.Router();

// дії з контактами
// router.get('/', checkToken, (req, res) => {
//     // Отримайте userId з req.user після перевірки токена
//     const userId = req.user.id;
  
//     // Перенаправте запит на URL з userId
//     res.redirect(`/api/contacts/${userId}`);
//   });

// router.post('/', checkToken, (req, res) => {
//     // Отримайте userId з req.user після перевірки токена
//     const userId = req.user.id;
  
//     // Перенаправте запит на URL з userId
//     res.redirect(`/api/contacts/${userId}`);
//   });

router.get('/:userId', checkToken, controller.getAllContacts);
router.get('/:contactId', checkToken, controller.getContactById);
router.post('/:userId', checkToken, controller.newContact);
router.delete('/:contactId', checkToken, controller.deleteContact);
router.put('/:contactId', checkToken, controller.updatedContactById);
router.patch('/:contactId/favorite', checkToken, controller.favoritStatus);

module.exports = router;
