//Dependencies
const express = require('express');
const router = express.Router();
const postController = require('./../controllers/postController');
const path = require('path');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//API home route
router.get('/', (req, res, next) => {
  res.sendFile('index.html');
})

router.get('/get-userid', (req, res, next) => {
  res.sendFile(path.resolve('./src/getuserid.html'));
})

/****** ROUTES FOR SEMINAR  *****/

// get all posts of a user
router.get('/post/:userid', (req, res, next) => {
  if(req.params.userid){
    postController.getUserTestPost(req.params.userid, (err, posts) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json(posts);
    })
  }else
    res.status(403).json('Please Provide userid');
});

// get a specific post of a specfic user
router.get('/post/:userid/:postid', (req, res, next) => {
  postController.getTestPost(req.params.postid, (err, post) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json(post);
  });
});

// Add New Post
router.post('/post/:userid', (req, res, next) => {
  if(req.params.userid){
    req.body.author = req.params.userid;
    postController.addPost(req.body, (err, post) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json(post);
    });
  }
  else
    res.status(403).json('Please Provide userid');
});

// Delete a Post
router.delete('/post/:userid/:postid', (req, res, next) => {
  postController.deletePost(req.params.postid, req.params.userid, (err, success) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json(success);
  })
});

module.exports = router;