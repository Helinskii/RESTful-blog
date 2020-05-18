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

// Register ROUTE - for registering a new user
router.get('/register', function(req, res) {
  res.render('register');
});

module.exports = router;
