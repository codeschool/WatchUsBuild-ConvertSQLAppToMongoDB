var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.
  get('/', function(req, res, next) {
    res.render('index');
  });

module.exports = router;
