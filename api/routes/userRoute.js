//Dependencies
const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const postController = require('./../controllers/postController');

//Route to user Posts;
router.get('/', (req, res) => {
  if(req.session.userid)
    postController.getUserPost(req.session.userid, (err, posts) => {
      if(err)
        res.status(500).json(err);
      else
        res.status(200).json(posts);
    })
  else
    res.status(403).json('Please Login First');
});

//Route to create new user
router.post('/newUser', (req, res) => {
  userController.createUser(req.body, (err, user) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json(user);
  })
})

//Route to authenticate user
router.post('/login', (req, res) => {
  userController.authenticateUser(req.body, (err, user) => {
    if(err)
      res.status(403).json(err);
    else{
      req.session.userid = user._id;
      res.status(200).json(user);
    }
  })
})

//Route to logout user
router.get('/logout', (req, res) => {
  req.session.userid = null;
  if(req.session.userid)
    res.status(500).json('An Error Occured');
  else
    res.status(200).json('Logged Out Successfully');
})

module.exports = router;