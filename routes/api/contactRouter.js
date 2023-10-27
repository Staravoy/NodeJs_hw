const express = require('express');
const checkToken = require('../../middlewares/authMiddleware')
const controller = require('../../controllers')

const router = express.Router();

// дії з контактами
router.get('/', checkToken, controller.getAllContacts);
router.get('/:contactId', checkToken, controller.getContactById);
router.post('/', checkToken, controller.newContact);
router.delete('/:contactId', checkToken, controller.deleteContact);
router.put('/:contactId', checkToken, controller.updatedContactById);
router.patch('/:contactId/favorite', checkToken, controller.favoritStatus);

module.exports = router;
