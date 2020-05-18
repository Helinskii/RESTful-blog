// Import dependencies
var express = require('express');

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
      res.render('index', {blogs: blogs});
    }
  });
});

// New Route - Display a new 'Blog Post' form
router.get('/new', function(req, res) {
  res.render('new');
});

// Create Route - Create a new 'Blog Post'
router.post('/', function(req, res) {
  // Sanitize the 'body' of the 'blog'
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Create 'blog' in the database
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
      res.render('new');
    } else {
      res.redirect('/blogs/' + newBlog._id);
    }
  });
});

// Show Route - Display a single 'Blog Post'
router.get('/:id', function(req, res) {
  // Find 'Blog Post' in the database using the ID
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Render 'show' template with 'blog' object
      res.render('show', {blog: foundBlog});
    }
  });
});

// Edit Route - Display form to edit 'Blog Post'
router.get('/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Render 'edit' template with 'blog' object
      res.render('edit', {blog: foundBlog});
    }
  });
});

// Update Route - Update the 'Blog Post'
router.put('/:id', function(req, res) {

  // Sanitize the body of the 'blog post'.
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Find 'Blog Post' by ID in the database and update it
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Redirect to the 'Blog Post' after updating
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// Delete Route - Delete the 'Blog Post'
router.delete('/:id', function(req, res) {
  // Find 'Blog Post' by ID and delete it
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      // Render index after deleting 'Blog Post'
      res.redirect('/blogs');
    }
  });
});

module.exports = router;
