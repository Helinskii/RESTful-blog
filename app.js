// Import all dependencies
var expressSanitizer  = require('express-sanitizer'),
    methodOverride    = require('method-override'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    express           = require('express'),
    app               = express();

// Import schemas
var Blog = require('./models/blog');

// Import routes
var blogRoutes = require('./routes/blogs');

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

// Root Route - Redirects to '/blogs'
app.get('/', function(req, res) {
  // Redirect to '/blogs' route
  res.redirect('/blogs');
});

app.use('/blogs', blogRoutes);

// Start server on PORT 3000
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log('Server started on PORT: ' + port);
});
