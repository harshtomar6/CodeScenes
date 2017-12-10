//Dependencies
let mongoose = require('mongoose');
let schema = require('./../models/schema');

//Model
let User = mongoose.model('User', schema.userSchema);

//Get All Users
let getAllUsers = (callback) => {
  User.find({}, (err, users) => {
    callback(err, users);
  })
}

//Create new User
let createUser = (data, callback) => {
  
  User.findOne({email: data.email}, (err, user) => {
    if(err)
      return callback(err, null);
    else{
      if(user)
        return callback('User Already Registered! Please Login', null);
      else{

        let user = new User(data);
        user.password = user.genHash(data.password);

        user.save((err, doc) => {
          return callback(err, doc);
        })
      }
    }
  })
}

//Authenticate User
let authenticateUser = (data, callback) => {
  User.findOne({email: data.email}, (err, user) => {
    if(err)
      return callback(err, null);
    else{
      if(!user)
        return callback('User not found!', null);
      else{
        if(user.compareHash(data.password))
          return callback(null, user)
        else
          return callback('Wrong Password!', null);
      }
    }
  })
}

module.exports = {
  getAllUsers,
  createUser,
  authenticateUser
}