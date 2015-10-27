var express = require('express');
var passport = require('passport');
var router = express.Router();

router.
  get('/auth/github', passport.authenticate('github'), function(req, res){
    // Request gets send to Github
  })
  .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/news/new' }), function(req, res) {
    // Callback that we set in Github
    res.redirect('/'); 
    // res.redirect(req.session.returnTo || '/news');
  })

module.exports = router;
