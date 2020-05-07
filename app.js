var methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    express         = require('express'),
    app             = express();

// TODO: Blog Model
//       Title - Image - Body - Created (date)

// Configure mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/restful_blog');

// Configure Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Set up schema for the blog
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

// Create the 'Blog' model based on the schema
var Blog = mongoose.model('Blog', blogSchema);

// Test if DB configuration is working
// Blog.create({
//   title: 'Test Blog',
//   image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
//   body: 'This is a blog post'
// });

// RESTful Routes
// Root Route; Redirects to '/blogs'
app.get('/', function(req, res) {
  res.redirect('/blogs');
});

// Index Route
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// New Route
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

// Create Route
app.post('/blogs', function(req, res) {
  // Create blog
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// Show Route
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});

// Edit Route
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});

// Update Route
app.put('/blogs/:id', function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// Start server on PORT 3000
app.listen(3000, function() {
  console.log('RESTful Blog app server started on PORT 3000');
});
