const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  link: String,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;