//Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Test Post Schema
let testPostSchema = mongoose.Schema({
  timestamp: {type: Date, default: Date.now},
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: mongoose.Schema.Types.ObjectId, required: true},
  isPublished: Boolean,
  comments: Array,
})

//Post Schema
let postSchema = mongoose.Schema({
  timestamp: {type: Date, default: Date.now},
  headerImage: {type: String, default: 'none'},
  title: {type: String, required: true},
  content: {type: String, required: true}, 
  author: {type: mongoose.Schema.Types.ObjectId, required: true},
  isPublished: {type: Boolean, default: false},
  likes: {type: Array, default: []},
  comments: {type: Array, default: []},
})

//User Schema
let userSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, default: 'No description'},
  avatar: {type: String, default: 'none'},
})

userSchema.methods.genHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = {
  postSchema,
  userSchema,
  testPostSchema
};
