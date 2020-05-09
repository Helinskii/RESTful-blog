// Import all dependencies
var expressSanitizer  = require('express-sanitizer'),
    methodOverride    = require('method-override'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    express           = require('express'),
    app               = express();

// TODO: Blog Model
//       Title - Image - Body - Created (date)

// Configure mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// Connect to the database
mongoose.connect('mongodb://localhost/restful_blog');

// Configure Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Set up schema for the blog
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now // Gives the current system date
  }
});

// Create the 'Blog' model based on the schema
var Blog = mongoose.model('Blog', blogSchema);

// To store the current date
var event;

// RESTful Routes

// Root Route - Redirects to '/blogs'
app.get('/', function(req, res) {
  // Redirect to '/blogs' route
  res.redirect('/blogs');
});

// Index Route - Display all 'Blog Posts'
app.get('/blogs', function(req, res) {
  // Retrieve all 'Blog Posts' from the database
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      event = new Date();
      console.log('Rendered index : ' + event.toLocaleTimeString());
      // Renders the 'index' template with 'blogs' object
      res.render('index', {blogs: blogs});
    }
  });
});

// New Route - Display a new 'Blog Post' form
app.get('/blogs/new', function(req, res) {
  // Renders the 'new' template
  event = new Date();
  console.log('Rendered new : ' + event.toLocaleTimeString());
  res.render('new');
});

// Create Route - Create a new 'Blog Post'
app.post('/blogs', function(req, res) {
  // Sanitize the 'body' of the 'blog'
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Create 'blog' in the database
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
      res.render('new');
    } else {
      event = new Date();
      console.log('Created new : ' + event.toLocaleTimeString());
      res.redirect('/blogs/' + newBlog._id);
    }
  });
});

// Show Route - Display a single 'Blog Post'
app.get('/blogs/:id', function(req, res) {
  // Find 'Blog Post' in the database using the ID
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      event = new Date();
      console.log('Rendered show : ' + event.toLocaleTimeString());
      // Render 'show' template with 'blog' object
      res.render('show', {blog: foundBlog});
    }
  });
});

// Edit Route - Display form to edit 'Blog Post'
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      event = new Date();
      console.log('Edited : ' + event.toLocaleTimeString());
      // Render 'edit' template with 'blog' object
      res.render('edit', {blog: foundBlog});
    }
  });
});

// Update Route - Update the 'Blog Post'
app.put('/blogs/:id', function(req, res) {

  // Sanitize the body of the 'blog post'.
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Find 'Blog Post' by ID in the database and update it
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      event = new Date();
      console.log('Updated : ' + event.toLocaleTimeString());
      // Redirect to the 'Blog Post' after updating
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// Delete Route - Delete the 'Blog Post'
app.delete('/blogs/:id', function(req, res) {
  // Find 'Blog Post' by ID and delete it
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      event = new Date();
      console.log('Deleted : ' + event.toLocaleTimeString());
      // Render index after deleting 'Blog Post'
      res.redirect('/blogs');
    }
  });
});

// Start server on PORT 3000
app.listen(3000, function() {
  console.log('RESTful Blog app server started on PORT 3000');
});
