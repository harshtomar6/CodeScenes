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
            authorid: post.author,
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

  User.findOne({_id: data.author}, (err, doc) => {
    if(doc == null)
      return callback('Userid Not Found', null);

    if(doc)
      post.save((err, success) => {
        return callback(err, success);
      })
    else
      return callback(err, null);
  });
}

// Get a specific post
let getPost = (postid, callback) => {
  Post.findOne({_id: postid}, (err, success) => {
    if(success == null)
      return callback('No Post Found', null);
    
    if(err)
      return callback(err, null);
    else
      return callback(null, success);
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
  Post.findOne({_id: id, author: author}, (err, success) => {
    if(success == null)
      return callback('No Post Found', null);
    
    if(err)
      return (err, null);
    else{
      Post.remove({_id: id, author: author}, (err, deleted) => {
        callback(err, success);
      })
    }
  })
}


module.exports = {
  addPost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
  getUserPost,
  publishPost
}
