// Import dependencies
var mongoose = require('mongoose');

// Set up schema for the blog
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now // Gives the current system date
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

// Create the 'Blog' model based on the schema
module.exports = mongoose.model('Blog', blogSchema);
