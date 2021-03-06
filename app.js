// Import all dependencies
var expressSanitizer  = require('express-sanitizer'),
    methodOverride    = require('method-override'),
    localStrategy     = require('passport-local'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    passport          = require('passport'),
    session           = require('express-session'),
    express           = require('express'),
    flash             = require('connect-flash');
    app               = express();

var MongoStore        = require('connect-mongo')(session);


// Import schemas
var Blog = require('./models/blog'),
    User = require('./models/user');

// Import routes
var commentRoutes = require('./routes/comments'),
    indexRoutes   = require('./routes/index'),
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
app.use(flash());

// Session setup
app.use(session({
  secret: 'Hakoona Matata',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 } // 180 minutes session expiration
}));
app.use(passport.initialize());
app.use(passport.session());

// Import 'moment' and make it available to all views
app.locals.moment = require('moment');

// Configure Passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make variables available to all ROUTES
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Configure Express to use routes
app.use(indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);

// Start server on PORT 3000
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log('Server started on PORT: ' + port);
});
