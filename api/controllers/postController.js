//Dependencies
const mongoose = require('mongoose');
const schema = require('./../models/schema');

//Models
const Post = mongoose.model('Post', schema.postSchema);
const User = mongoose.model('User', schema.userSchema);

//Get All Posts
let getAllPosts = (callback) => {
  Post.find({isPublished: true}, '_id title comments author', (err, success) => {
    let data = [];
    let count = 0;

    success.forEach((post, index, array) => {
      User.findOne({_id: post.author}, 'name description email',
      (err, author) => {
        count++;
        data.push({
          id: post._id,
          title: post.title,
          comments: post.comments.length,
          author: {
            name: author.name,
            description: author.description,
          },
          link: author.email.split('@')[0]+'/'+post.title.toLowerCase().split(' ').join('-')
        })

        if(count === array.length){
          return callback(err, data);
        }

      })
    })
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
  getAllPosts,
  deletePost,
  updatePost,
  getUserPost,
  publishPost
}
