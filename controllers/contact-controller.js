
const getPath = require('../helpers/get-path');

const getContacts = (req, res) => {
  res.render(getPath('contacts.ejs'), { title: 'Contacts' });
};

module.exports = {
  getContacts
};