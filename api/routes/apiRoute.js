//Dependencies
const express = require('express');
const router = express.Router();
const postController = require('./../controllers/postController');
const config = require('./../../config');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key");
  next();
});

//API home route
router.get('/', (req, res, next) => {
  res.json('API Working');
})

// Route to get all posts
router.get('/post', (req, res, next) => {
  postController.getAllPosts((err, posts) => {
    if(err)
      res.status(500).json({err, data: null});
    else
      res.status(200).json({err: null, data: posts});
  })
});

// Route to get a post
router.get('/post/:id', (req, res, next) => {
  postController.getPost(req.params.id, (err, status, posts) => {
    res.status(status).json({err: err, data: posts});
  })
});

// Route to add new post
router.post('/post', config.validateRequest, (req, res, next) => {
  req.body.author = req.headers['x-key'];
  console.log(req.body);
  postController.addPost(req.body, (err, post) => {
    if(err)
      res.status(500).json({err: err, data: null});
    else
      res.status(200).json({err: err, data: post});
  })
})

//Route to publish post
router.get('/post/:postId/publish', config.validateRequest, (req, res, next) => {
  postController.publishPost(req.params.postId, (err, status, doc) => {
    res.status(status).json({err: err, data: doc});
  })    
})

//Route to update post
router.put('/post/:postId', config.validateRequest, (req, res, next) => {
  postController.updatePost(req.params.postId, req.body.data, req.headers['x-key'], (err, post) => {
    res.status(status).json({err: err, data: post})
  })
})

//Route to delete post
router.delete('/post/:postId', config.validateRequest, (req, res, next) => {
  postController.deletePost(req.params.postId, req.headers['x-key'], (err, success) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json("Deleted Successfully");
  })
})

module.exports = router;
