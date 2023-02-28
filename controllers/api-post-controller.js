
const Post = require('../models/post');

const getAllPosts = (req, res) => {
  Post
    .find()
    .sort({ createdAt: -1 })
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
};

const addPost = (req, res) => {
  if (req.body.title) {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body || null,
      author: req.body.author || null
    });
    newPost
      .save()
      .then(() => res.status(201).send(newPost))
      .catch(err => {
        res.status(500).send({ error: err });
        console.log(err);
      });
  }
  else {
    res.statusMessage = "Field 'title' is required";
    res.status(400).send({ error: "Field 'title' is required" });
  }
};

const getOnePost = (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => {
      if (post) {
        res
          .status(200)
          .send({...post._doc });
      } else {
        res
          .status(404)
          .send({ error: "Post not found" });
      }
    })
    .catch(error => {
      if (error.name === 'CastError') {
        res.status(404).send({ error: "Post not found" });
      } else {
        res.status(500).send({ error: error.message });
      }
    });
};

const editPost = (req, res) => {
  const { title, body, author } = req.body;
  Post
    .findByIdAndUpdate(req.params.id, { title, body, author })
    .then(post => {
      if (post) {
        res
          .status(200)
          .send({ ...post._doc });
      } else {
        res
          .status(404)
          .send({ error: "Post not found" });
      }
    })
    .catch(error => {
      if (error.name === 'CastError') {
        res.status(404).send({ error: "Post not found" });
      } else {
        res.status(500).send({ error: error.message });
      }
    });
};

const deletePost = (req, res) => {
  Post
    .findByIdAndDelete(req.params.id)
    .then(post => {
      if (post) {
        res
          .status(200)
          .send({ ...post._doc });
      } else {
        res
          .status(404)
          .send({ error: "Post not found" });
      }
    })
    .catch(error => {
      if (error.name === 'CastError') {
        res.status(404).send({ error: "Post not found" });
      } else {
        res.status(500).send({ error: error.message });
      }
    });
};

module.exports = {
  getAllPosts,
  getOnePost,
  addPost,
  editPost,
  deletePost
};