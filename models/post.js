const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: String,
  author: String
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;