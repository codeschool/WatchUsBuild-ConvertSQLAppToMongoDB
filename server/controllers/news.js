var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var moment = require('moment');
var pluralize = require('pluralize');
var expressValidator = require('express-validator');

var Articles = require(path.join(__dirname, '..', 'models', 'articles'));
var Users = require(path.join(__dirname, '..', 'models', 'users'));

var csrfProtection = csrf();
var parseForm = bodyParser.urlencoded({ extended: false });
var parseJson = bodyParser.json();
var authenticator = require("../services/authenticator")
var debug = require('debug')('JavaScript.com:server');

// -------------------------------------
//  Middleware
// -------------------------------------

function addhttp(req, res, next) {
  var url = req.body.url
  if(!url.match(/^(http|https):\/\//)){
        req.body.url = "http://" + url;
  }
  next();
}

// -------------------------------------
//  Routes
// -------------------------------------

router.

  // GET news page
  get('/', parseForm, function(req, res) {
    Articles.recent(function(err, docs){
        res.render('news/index', {docs: docs})
    });
  }).

  // GET new article form page
  get('/new', cookieParser, csrfProtection, function(req, res) {
    if(!req.isAuthenticated()){
      // Set location in session where to return user after login
      req.session.returnTo = '/news' + req.path
      res.redirect('/users/sign_in');
    }else{
      var csrfToken = req.csrfToken();
      var login = req.user['_json']['login'];
      var avatar = req.user['_json']['avatar_url'];

      res.render('news/new', { login: login, avatar: avatar, token: csrfToken });
    }
  }).

  // Get news page for individual news stories
  get('/:slug([a-zA-Z0-9_.-]+)', cookieParser, csrfProtection, function(req, res) {
    var slug = req.params.slug;
    // Grab user details for commenting
    var user = {
      "authenticated": req.isAuthenticated(),
    }

    if (user.authenticated) {
      user.login      = req.user['_json']['login'];
      user.avatar_url = req.user['_json']['avatar_url'];
      user.id         = req.user._id;
    }

    Articles.findBySlug(slug, function(err, doc) {
      if(doc){
        res.render('news/show', { doc: doc, user: user, token: req.csrfToken(), moment: moment, pluralize: pluralize });
      }else{
        // Story doesn't exist
        res.render('404');
      }
    });
  }).

  // POST create new article
  post('/', cookieParser, authenticator.authorize, parseForm, addhttp, expressValidator(), csrfProtection, function(req, res) {

    // Validations
    req.check('title','Title is required' ).notEmpty();
    req.check('url', 'URL is required').notEmpty();
    req.check('url', 'URL is not valid').isURL();
    req.check('body', 'Description is required').notEmpty();
    req.check('body', 'Description must be between 100 and 300 characters').len(100,300);

    var errors = req.validationErrors();

    if (errors) {
      errors.map(function(error) {
        res.flash('error', error.msg);
      });
      res.status(400).render('news/new', {token: req.csrfToken(), title: req.body.title, url: req.body.url, body: req.body.body});
    }else{
      var args = {
        title : req.body.title,
        body  : req.body.body,
        url   : req.body.url,
        user  : req.user
      }
      Articles.create(args, function(err) {
        if(err) { throw err };
        res.redirect('/news/');
      });
    }
  }).
 
  // POST add new comment to article
  post('/:slug([a-zA-Z0-9_.-]+)/comment', cookieParser, authenticator.authorize, parseForm, expressValidator(), csrfProtection, function(req, res) {
    // Validatations
    req.sanitize('body').trim();
    req.check('body').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.json({error: "Comment cannot be empty"});
    }else{
      var args = {
        slug    : req.params.slug,
        comment : req.body,
        user    : req.user
      };

      Articles.addComment(args, function(err, doc) {
        res.json({doc: doc});
      });
    }
  }).

  // PUT update comment in article
  put('/:slug([a-zA-Z0-9_.-]+)/comment/:id([a-zA-Z0-9]+)', cookieParser, authenticator.authorize, parseForm, csrfProtection, function(req, res) {
    var args = {
      updatedComment : req.body.body,
      slug           : req.params.slug,
      commentId      : req.params.id,
      user           : req.user
    }

    Articles.editComment(args, function(err, doc){
      if(doc){
        res.send(200)
      }else{
        res.send(404)
      }
    });
  }).

  // DELETE remove comment in article
  delete('/:slug([a-zA-Z0-9_.-]+)/comment/:id([a-zA-Z0-9]+)', cookieParser, authenticator.authorize, csrfProtection, function(req, res) {
    var args = {
      slug     :  req.params.slug,
      commentId : req.params.id,
      user    : req.user
    }

    Articles.deleteComment(args, function(err) {
      if(err) { throw err };
      res.send(200)
    });
  });

  
module.exports = router;
