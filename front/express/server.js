// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session      = require('express-session');
mongoose.connect("mongodb://localhost/database");
// Get our API routes
const api = require('./routes/api');

const app = express();
//app.use(logger('dev'));
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// required for passport
app.use(session({ secret: 'thesecretpatient' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers","X-CSRF-Token, Origin, X-Requested-With, Content-Type, Accept,login")
  next()
})
require('./config/passport')(passport);
// Set our api routes
app.use('/', api);


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
 // catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({data:err.message});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
});

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
