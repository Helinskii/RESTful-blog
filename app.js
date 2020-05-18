// Import all dependencies
var expressSanitizer  = require('express-sanitizer'),
    methodOverride    = require('method-override'),
    localStrategy     = require('passport-local'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    passport          = require('passport'),
    express           = require('express'),
    app               = express();

// Import schemas
var Blog = require('./models/blog'),
    User = require('./models/user');

// Import routes
var indexRoutes   = require('./routes/index'),
    blogRoutes    = require('./routes/blogs');

// Configure mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// Connect to the database
var url = process.env.DATABASEURL || 'mongodb://localhost/restful_blog';
mongoose.connect(url).then(function() {
  console.log('Connected to DB.');
}).catch(function(err) {
  console.log('ERROR: ' + err.message);
});

// Configure Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Configure Express to use Passport
app.use(require('express-session') ({
  secret: 'Hakoona Matata',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Root Route - Redirects to '/blogs'
app.get('/', function(req, res) {
  // Redirect to '/blogs' route
  res.redirect('/blogs');
});

app.use(indexRoutes);
app.use('/blogs', blogRoutes);

// Start server on PORT 3000
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log('Server started on PORT: ' + port);
});
