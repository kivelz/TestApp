const express = require('express');
const engine = require('ejs-mate');
const morgan = require('morgan')
const path = require('path');
const expressSanitizer =  require('express-sanitizer');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOveride = require('method-override');
var MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
var store = new MongoDBStore({
    uri: process.env.DATABASEURL,
    collection: 'session'
  });

require('./config/passport');
// const seedDB = require('./seeds');


// seedDB();

app.use(morgan('dev'));
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/sgfinal', { useNewUrlParser: true });


// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   console.log('we\'re connected!');
// });

// View Engine
app.engine('ejs', engine);
app.locals.moment = require('moment');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
      
app.use(methodOveride("_method"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  secret: 'gayassshit',
  saveUninitialized: false,
  resave: false,
  store: store,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next)=> {
  // req.user = {
  //  '_id' : '5bfa611f7194ad136073d8c9',
  //  'username' : 'kivelz',
  //  'isAdmin': true
   
  // }
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.page = '';
  next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/services', require('./routes/services'));
app.use("/services/:id/reviews", require('./routes/reviews'));
app.use("/", require('./routes/admin'))



// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  app.listen(process.env.PORT || 3000, function(){
    console.log("The YelpCamp Server Has Started!");
 });