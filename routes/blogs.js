// Import dependencies
var express = require('express');
var middleware = require('../middleware');

// Define 'router'
var router = express.Router();

// Import schemas
var Blog = require('../models/blog');

// Index Route - Display all 'Blog Posts'
router.get('/', function(req, res) {
  // Retrieve all 'Blog Posts' from the database
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      // Renders the 'index' template with 'blogs' object
      res.render('blogs/index', {blogs: blogs, page: 'blogs'});
    }
  });
});

// New Route - Display a new 'Blog Post' form
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('blogs/new', {page: 'new'});
});

// Create Route - Create a new 'Blog Post'
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Sanitize the 'body' of the 'blog'
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Create 'blog' in the database
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong. Please try again.');
      res.render('blogs/new');
    } else {
      // Add username and ID to blog
      newBlog.author.id = req.user._id;
      newBlog.author.username = req.user.username;
      newBlog.save();

      res.redirect('/blogs/' + newBlog._id);
    }
  });
});

// Show Route - Display a single 'Blog Post'
router.get('/:id', function(req, res) {
  // Find 'Blog Post' in the database using the ID
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err || !foundBlog) {
      console.log(err);
      req.flash('error', 'Blog not found.');
      res.redirect('/blogs');
    } else {
      // Render 'show' template with 'blog' object
      res.render('blogs/show', {blog: foundBlog});
    }
  });
});

// Edit Route - Display form to edit 'Blog Post'
router.get('/:id/edit', middleware.checkBlogOwnership, function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong. Please try again.');
      res.redirect('/blogs/' + req.params.id);
    } else {
      // Render 'edit' template with 'blog' object
      res.render('blogs/edit', {blog: foundBlog});
    }
  });
});

// Update Route - Update the 'Blog Post'
router.put('/:id', middleware.checkBlogOwnership, function(req, res) {

  // Sanitize the body of the 'blog post'.
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Find 'Blog Post' by ID in the database and update it
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Redirect to the 'Blog Post' after updating
      req.flash('success', 'Blog updated successfully.');
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// Delete Route - Delete the 'Blog Post'
router.delete('/:id', middleware.checkBlogOwnership, function(req, res) {
  // Find 'Blog Post' by ID and delete it
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Render index after deleting 'Blog Post'
      req.flash('success', 'Blog deleted successfully.');
      res.redirect('/blogs');
    }
  });
});

module.exports = router;
