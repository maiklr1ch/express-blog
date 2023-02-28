
const Contact = require('../models/contact');

const getAllContacts = (req, res) => {
  Contact
    .find()
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
};

const getOneContact = (req, res) => {
  Contact
    .findById(req.params.id, null, { lean: true })
    .then(contact => {
      if (contact) {
        res
          .status(200)
          .send(contact);
      } else {
        res
          .status(404)
          .send({ error: "Contact not found" });
      }
    })
    .catch(error => {
      if (error.name === 'CastError') {
        res.status(404).send({ error: "Contact not found" });
      } else {
        res.status(500).send({ error: error.message });
      }
    });
};

const addContact = (req, res) => {
  if (req.body.name) {
    const newContact = new Contact({
      name: req.body.name,
      link: req.body.link || null
    });
    newContact
      .save()
      .then(() => res.status(201).send(newContact))
      .catch(error => res.status(500).send({ error }));
  }
  else {
    res.statusMessage = "Field 'name' is required";
    res.status(400).send({ error: "Field 'name' is required" });
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  addContact
};