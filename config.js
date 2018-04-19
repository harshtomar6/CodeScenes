const jwt = require('jwt-simple');
const userController = require('./api/controllers/userController');

let validateRequest = (req, res, next) => {
  let token = req.headers['x-access-token'];
  let key = req.headers['x-key'];

  if(token && key){
    try{

      let decoded = jwt.decode(token, process.env.SESSION_SECRET);

      if(decoded.exp <= Date.now()){
        res.status(400).json({err: 'Token expired ! Login Again', data:null});
        return;
      }

      userController.getUserById(key, (err, status, data) => {
        if(err){
          res.status(status).send({err: err, data: null});
        }
        else if(status == 200)
          next()
      });
    }catch(err){
      res.status(500).err({err: 'Something Weird happened', data: null})
    }
  }else{
    res.status(401).json({err: 'Key Or Token Not Found', data: null});
  }
}

module.exports = {
  validateRequest
}