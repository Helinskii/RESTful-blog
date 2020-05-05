var express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    app         = express();

// TODO: Blog Model
//       Title - Image - Body - Created (date)

// Configure mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/restful_blog');

// Configure Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

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
app.get('/', function(req, res) {
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// Start server on PORT 3000
app.listen(3000, function() {
  console.log('RESTful Blog app server started on PORT 3000');
});
