var express = require('express');
var router = express.Router();

router
  .get('/signout', function(req, res){
    req.logout();
    res.redirect('/news');
  })

  .get('/sign_in', function(req, res) {
    res.render('users/sign_in');
  });

module.exports = router;
