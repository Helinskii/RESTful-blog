// Import dependencies
var passport  = require('passport');
var express   = require('express');

// Define router
var router = express.Router();

// Import schemas
var User = require('../models/user');

/////////////////
// Auth Routes //
/////////////////

// Register ROUTE - Form for registering a new user
router.get('/register', function(req, res) {
  res.render('register');
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
      return res.redirect('register');
    }
    // If registration is successful redirect to 'blogs' page
    passport.authenticate('local')(req, res, function() {
      res.redirect('/blogs');
    });
  });
});

// Login ROUTE - Form for logging in
router.get('/login', function(req, res) {
  res.render('login');
});

// Login user using Passport middleware
router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login'
}), function(err, req, res) {
});

// Logout ROUTE
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/blogs');
});

module.exports = router;
