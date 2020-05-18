// Import dependencies
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Define schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Export schema
module.exports = mongoose.model('User', userSchema);
