// Import dependencies
var express = require('express');
var middleware = require('../middleware');

// Define 'router'
var router = express.Router({mergeParams: true});

// Import schemas
var Blog = require('../models/blog'),
    Comm = require('../models/comment');

// Create ROUTE
router.post('/', function(req, res) {
  // Find 'blog'
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err || !foundBlog) {
      console.log(err);
      req.flash('error', 'Blog not found.');
      res.redirect('/blogs');
    } else {
      // Create a new comment
      Comm.create(req.body.comment, function(err, newComment) {
        if (err || !newComment) {
          console.log(err);
          req.flash('error', 'Something went wrong. Please try again.');
          res.redirect('/blogs/' + foundBlog._id);
        } else {
          // Add username and ID to blog
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();

          // Connect new 'comment' to 'blog'
          foundBlog.comments.push(newComment);
          foundBlog.save();

          req.flash('success', 'Successfully created comment.');
          res.redirect('/blogs/' + foundBlog._id);
        }
      });
    }
  });
});

// Edit ROUTE

// Delete ROUTE
router.delete('/:comment_id', function(req, res) {
  Comm.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      console.log(err);
      req.flash('error', 'Could not delete comment.');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted.');
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

module.exports = router;
