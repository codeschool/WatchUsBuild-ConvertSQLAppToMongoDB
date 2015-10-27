var express = require('express');
var router = express.Router();

/* GET /resources page */
router.get('/', function(req, res) {
  res.render('resources/index');
});

module.exports = router;
