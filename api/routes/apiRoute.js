//Dependencies
const express = require('express');
const router = express.Router();
const postController = require('./../controllers/postController');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//API home route
router.get('/', (req, res, next) => {
  res.json('API Working');
})

//Route to get all posts
router.get('/getAllPosts', (req, res, next) => {
  postController.getAllPosts((err, posts) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json(posts);
  })
})

//Route to add new post
router.post('/addPost', (req, res, next) => {
  if(req.session.userid){
    req.body.author = req.session.userid;
    postController.addPost(req.body, (err, post) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json(post);
    })
  }
  else
    res.status(403).json('Please Login First');
})

//Route to publish post
router.post('/publish', (req, res, next) => {
  if(req.session.userid)
    postController.publishPost(req.body.id, (err, doc) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json('Post Published Successfully!')
    })
  else
    res.status(403).json('Please Login First');
})

//Route to update post
router.post('/updatePost', (req, res, next) => {
  if(req.session.userid)
    postController.updatePost(req.body.id, req.body.data, req.session.userid, (err, post) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json(post);
    })
  else
    res.status(403).json('Please Login First');

})

//Route to delete post
router.post('/deletePost', (req, res, next) => {
  if(req.session.userid)
    postController.deletePost(req.body.id, req.session.userid, (err, success) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json("Deleted Successfully");
    })
  else
    res.status(403).json('Please Login First');

})

module.exports = router;
