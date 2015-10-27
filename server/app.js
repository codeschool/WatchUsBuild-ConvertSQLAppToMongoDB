// GLOBAL because it's used everywhere
path = require('path');

// Cofigurations to set before requirements
require('./config');

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var authenticator = require(path.join(__dirname, 'services', 'authenticator'));
var dbConnection = require(path.join(__dirname, 'services', 'dbConnection'));

// Connect to Mongo
dbConnection.connect();

// Initialize authentication
authenticator.init()

var app = express();
app.set('trust proxy', 1);

// Must come before calls to app.use
var passport = require('passport');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var redis = require('redis');
var redisHost = process.env.REDIS_HOST === undefined ? '127.0.0.1' : process.env.REDIS_HOST;
var client = redis.createClient(6379, redisHost, {});

// Don't set cookies to secure in dev.
var secureCookie = process.env.NODE_ENV === 'production' ? true : false
app.use(expressSession({
  store: new RedisStore({client: client}),
  secret: process.env.COOKIE_KEY || "this-secret-is-only-for-development-set-the-env-in-production"
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Flash messages
app.use(require('flash')());

// Load controllers
app.use(require(path.join(__dirname, 'controllers','routes')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('404');
    }else{
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
