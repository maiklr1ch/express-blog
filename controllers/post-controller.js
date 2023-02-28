
const Post = require('../models/post');
const getPath = require('../helpers/get-path');

const getPostsPage = (req, res) => {
  res.render(getPath('posts.ejs'), { title: 'All posts' });
};

const getAddPostPage = (req, res) => {
  res.render(getPath('add-post.ejs'), { title: 'Add a post' });
};

const getPostPage = (req, res) => {
  res.render(getPath('post.ejs'), { title: 'Post' });
};

const getEditPostPage = (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => res.render(getPath('edit-post.ejs'), { title: `Edit "${post.title}"`, post }))
    .catch(() => res.status(404).render(getPath('error.ejs'), { title: "Error 404", errorCode: 404, errorText: "Post not found" }));
};

module.exports = {
  getPostsPage,
  getAddPostPage,
  getPostPage,
  getEditPostPage
};