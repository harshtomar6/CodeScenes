//Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//Post Schema
let postSchema = mongoose.Schema({
  timestamp: {type: Date, default: Date.now},
  title: {type: String, required: true},
  content: {type: Array, required: true}, 
  author: {type: mongoose.Schema.Types.ObjectId, required: true},
  isPublished: Boolean
})

//User Schema
let userSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  description: String,
  avatar: String
})

userSchema.methods.genHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = {
  postSchema,
  userSchema
};