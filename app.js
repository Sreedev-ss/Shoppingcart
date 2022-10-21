var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var app = express();
var fileUpload = require('express-fileupload')
var db = require('./config/connection')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var session = require('express-session');
var Handlebars = require('handlebars');
var mongodbStore = require('connect-mongodb-session')(session);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static path
app.use(express.static(path.join(__dirname, 'public')));

//Mongodb session storing
var store = new mongodbStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  databaseName: 'Shopping',
  collection: 'mySession'
})

//File
app.use(fileUpload());

//Session
app.use(session({
  secret: "KeyofIndia",
  store : store,
  saveUninitialized: true,
  resave: true,
})
)

//Indexing SL.NO
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//Database Connect
db.connect((err) => {
  if (err) {
    console.log("Error while connetion" + err)
  } else {
    console.log("Database connected");
  }
})

//Header Cache remover
app.use(function (req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//Route setting
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
