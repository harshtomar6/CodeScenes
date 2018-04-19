//Dependencies
const mongoose = require('mongoose');
const schema = require('./../models/schema');
const { ObjectId } = require('mongodb');

//Models
const Post = mongoose.model('Post', schema.postSchema);
const User = mongoose.model('User', schema.userSchema);
const TestPost = mongoose.model('TestPost', schema.testPostSchema);

//Get All Posts
let getAllPosts = (callback) => {
  Post.find({isPublished: true}, '_id title headerImage comments author timestamp', (err, success) => {
    let data = [];
    let count = 0;

    if(err)
      return callback(err, null);

    success.forEach((post, index, array) => {
      User.findOne({_id: post.author}, 'name description email',
      (err, author) => {
        count++;
        data.push({
          id: post._id,
          title: post.title,
          headerImage: post.headerImage,
          timestamp : post.timestamp,
          comments: post.comments.length,
          author: {
            authorid: post.author,
            name: author.name,
            description: author.description,
          },
          link: author.email.split('@')[0]+'/'+post.title.toLowerCase().split(' ').join('-')
        })

        if(count === array.length){
          data = data.sort((a, b) => a.timestamp > b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0)
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

//Get User Test posts
let getUserTestPost = (id, callback) => {
  TestPost.find({author: id}, (err, posts) => {
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

//Add New Test Post
let addTestPost = (data, callback) => {
  let post = new TestPost(data);

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
  if(!ObjectId.isValid(postid))
    return callback('Invalid Post ID', 400, null);

  Post.findOne({_id: postid}, (err, success) => {
    if(success == null)
      return callback('No Post Found', 404, null);
    
    if(err)
      return callback(err, 500, null);
    else{
      User.findOne({_id: success.author}, 'name email description', (err, author) => {
        if(author){
          let data = {
            author: {}
          }
          data.title = success._doc.title;
          data.headerImage = success._doc.headerImage;
          data.timestamp = success._doc.timestamp;
          data.content = success._doc.content;
          data.isPublished = success._doc.isPublished;
          data._id = success._doc._id;
          data.author.name = author.name;
          data.author.email = author.email;
          data.author.description = author.description;
          data.author.avatar = author.avatar;
          return callback(null, 200, data);
        }else
          return callback(err, 500, null);
        
      })
    }
  })
}

// Get a specific test post
let getTestPost = (postid, callback) => {
  TestPost.findOne({_id: postid}, (err, success) => {
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
  if(!ObjectId.isValid(id))
    return callback('Invalid Post ID', 400, null);
  
  Post.findOne({_id: id}, (err, post) => {
    if(err)
      return callback(err, 500, null);
    else if(!post)
      return callback('No Post Found', 404, null);
    else{
      if(post.isPublished)
        return callback('Post is already published', 400, null);
      else{
        post.isPublished = true;
        post.save((err, success) => {
          if(err)
            return callback(err, 500, null);
          else
            return callback(null, 200, success);
        })
      }
    }
  });
}

//Update Post
let updatePost = (id, data, author, callback) => {
  if(!ObjectId.isValid(id))
    return callback('Invalid Post Id', 400, null);

  Post.findOne({_id: id, author: author}, (err, post) => {
    if(err)
      return callback(err, 500, null);
    else if(!post)
      return calback('No Post Found', 404, null);
    else
      Post.update({_id: id, author: author}, data, (err, doc) => {
        if(err) return callback(err, 500, null);
        return callback(null, 200, 'Post Updated');
      })
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
  publishPost,
  getTestPost,
  getUserTestPost,
  addTestPost
}
