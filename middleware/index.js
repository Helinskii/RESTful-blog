// All the middleware goes here
var middlewareObj = {};

// Import schemas
var Blog = require('../models/blog'),
    Comm = require('../models/comment');

// Middleware to check ownership of 'blog'
middlewareObj.checkBlogOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    // Find 'blog' in database by object ID
    Blog.findById(req.params.id, function(err, foundBlog) {
      // Check for error or whether a 'blog' is returned
      if (err || !foundBlog) {
        console.log(err);
        req.flash('error', 'Blog not found.');
        res.redirect('back');
      } else {
        // Check if user owns the blog
        if (foundBlog.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please login first.');
    res.redirect('/login');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comm.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        console.log(err);
        req.flash('error', 'Comment not found.');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please login first.');
    res.redirect('/login');
  }
};

// Middleware to check if session is authenticated
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'Please login first.');
  res.redirect('/login');
};

// Export 'middlewareObj'
module.exports = middlewareObj;
