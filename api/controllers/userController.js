//Dependencies
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const schema = require('./../models/schema');
const jwt = require('jwt-simple');

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
      return callback(err, 500, null);
    else{
      if(!user)
        return callback('User not found!', 401, null);
      else{
        if(user.compareHash(data.password))
          return callback(null, 200, generateToken(user))
        else
          return callback('Wrong Password!', 401, null);
      }
    }
  })
}

// Finds a particulat User
let getUserById = (id, callback) => {
  if(!ObjectId.isValid(id))
    return callback('Invalid User Key', 401, null);
  
  User.findOne({_id: id}, (err, user) => {
    if(err)
      return callback(err, 500, null);
    else if(!user)
      return callback('No User Found', 400, null);
    else
      return callback(null, 200, user);
  })
}

// Creates or find User for React Workshop
let createOrFindUser = (data, callback) => {
  User.findOne({email: data.email}, (err, user) => {
    if(err)
      return callback(err, null);
    else{
      if(user)
        return callback(null, user);
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

let generateToken = user => {
  let expires = expiresIn(7);
  let token = jwt.encode({
    exp: expires
  }, process.env.SESSION_SECRET);

  return {
    token,
    expires,
    user 
  }
}

let expiresIn = (num) => {
  let date = new Date();
  return date.setDate(date.getDate() + num);
}

module.exports = {
  getAllUsers,
  createUser,
  authenticateUser,
  createOrFindUser,
  getUserById
}