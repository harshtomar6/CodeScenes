//Dependencies
const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const postController = require('./../controllers/postController');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Route to user Posts;
router.get('/', (req, res, next) => {
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
router.post('/', (req, res, next) => {
  console.log(req.body);
  userController.createOrFindUser(req.body, (err, user) => {
    if(err)
      res.status(500).json(err);
    else
      res.status(200).json(user);
  })
})

//Route to authenticate user
router.post('/login', (req, res, next) => {
  userController.authenticateUser(req.body, (err, user) => {
    if(err)
      res.status(401).json(err);
    else{
      req.session.userid = user._id;
      res.status(200).json(user);
    }
  })
})

//Route to logout user
router.get('/logout', (req, res, next) => {
  req.session.userid = null;
  if(req.session.userid)
    res.status(500).json('An Error Occured');
  else
    res.status(200).json('Logged Out Successfully');
})

module.exports = router;