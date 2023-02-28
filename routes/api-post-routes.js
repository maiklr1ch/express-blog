
const express = require('express');
const router = express.Router();
const { 
  getAllPosts, 
  addPost, 
  getOnePost, 
  editPost, 
  deletePost 
} = require('../controllers/api-post-controller');

router.get('/api/posts', getAllPosts);
router.post('/api/posts', addPost);
router.get('/api/posts/:id', getOnePost);
router.put('/api/posts/:id', editPost);
router.delete('/api/posts/:id', deletePost);

module.exports = router;