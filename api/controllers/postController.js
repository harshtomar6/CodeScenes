//Dependencies
const mongoose = require('mongoose');
const schema = require('./../models/schema');

//Models
const Post = mongoose.model('Post', schema.postSchema);


//Get All Posts
let getPosts = (callback) => {
  Post.find({isPublished: true}, (err, success) => {
    callback(err, success);
  })
}

//Get User posts
let getUserPost = (id, callback) => {
  Post.find({author: id}, (err, posts) => {
    callback(err, posts);
  })
}

//Add New Post
let addPost = (data, callback) => {
  let post = new Post(data);

  post.save((err, success) => {
    return callback(err, success);
  })
}

//Publish Post
let publishPost = (id, callback) => {
  Post.update({_id: id}, {isPublished: true}, (err, doc) => {
    callback(err, doc);
  })
}

//Update Post
let updatePost = (id, data, author, callback) => {
  Post.update({_id: id, author: author}, data, (err, doc) => {
    callback(err, doc);
  })
}

//Delete post
let deletePost = (id, author, callback) => {
  Post.remove({_id: id, author: author}, (err, success) => {
    callback(err, callback);
  })
}

module.exports = {
  addPost,
  getPosts,
  deletePost,
  updatePost,
  getUserPost,
  publishPost
}