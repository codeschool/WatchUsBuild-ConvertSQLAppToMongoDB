var express = require('express');
var router = express.Router();

/* GET /styleguide page */
router.get('/', function(req, res) {
  res.render('styleguide/index');
});

module.exports = router;
