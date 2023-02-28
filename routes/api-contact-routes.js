
const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  addContact,
  getOneContact
} = require('../controllers/api-contact-controller');

router.get('/api/contacts', getAllContacts);
router.post('/api/contacts', addContact);
router.get('/api/contacts/:id', getOneContact);

module.exports = router;