// Import dependencies
var passport  = require('passport');
var express   = require('express');

// Define router
var router = express.Router();

// Import schemas
var User = require('../models/user');

// Root Route - Redirects to '/blogs'
router.get('/', function(req, res) {
  // Redirect to '/blogs' route
  res.redirect('/blogs');
});

/////////////////
// Auth Routes //
/////////////////

// Register ROUTE - Form for registering a new user
router.get('/register', function(req, res) {
  res.render('register', {page: 'register'});
});

// Create ROUTE - Register a new user in the DB
router.post('/register', function(req, res) {
  // Set username
  var newUser = new User({username: req.body.username});
  // Register user using Passport middleware
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // If registration is unsuccessful render the form again
      console.log(err);
      req.flash('error', err.message);
      return res.redirect('register');
    }
    // If registration is successful redirect to 'blogs' page
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Signed up successfully!');
      res.redirect('/blogs');
    });
  });
});

// Login ROUTE - Form for logging in
router.get('/login', function(req, res) {
  res.render('login', {page: 'login'});
});

// Login user using Passport middleware
router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login',
  successFlash: 'You\'re now logged in!',
  failureFlash: true
}), function(err, req, res) {
});

// Logout ROUTE
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You\'ve logged out successfully.');
  res.redirect('/blogs');
});

// Export 'router'
module.exports = router;
