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
  userController.authenticateUser(req.body, (err, status, user) => {
    res.status(status).send({err: err, data: user});
  })
})

//Route to logout user
router.post('/logout', (req, res, next) => {
  
})

module.exports = router;