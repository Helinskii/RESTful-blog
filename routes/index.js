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

// REGISTER ROUTE - Form for registering a new user
router.get('/register', function(req, res) {
  res.render('register');
});

// CREATE ROUTE - Register a new user in the DB
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

module.exports = router;
