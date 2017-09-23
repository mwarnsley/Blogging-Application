// Require in the modules needed for the server
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const moment = require('moment');
const routes = require('./routes/index');
const users = require('./routes/users');
const expressValidator = require('express-validator');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

const port = process.env.PORT || 3000;
const app = express();

// Setup the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Setting up all the middleware for the project
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  })
);

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Need to make the db accessible to our router
app.use(() => {
  req.db = db;
  next();
});
app.use('/', routes);
app.use('/users', users);
app.use(() => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
