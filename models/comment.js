// Import dependencies
var mongoose = require('mongoose');

// Define schema
var commentSchema = new mongoose.Schema({
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

// Export the 'Comment' model
module.exports = mongoose.model('Comment', commentSchema);
