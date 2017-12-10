//Dependencies
const mongoose = require('mongoose');
const schema = require('./../models/schema');

//Model
let Post = mongoose.model('Post', schema.postSchema);

Post.find({}, (err, docs) => {
  if(err)
    console.log(err)
  else
    console.log(docs)
})