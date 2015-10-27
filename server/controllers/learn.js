var express = require('express');
var router = express.Router();

/* GET /learn page */
router.get('/', function(req, res) {
  res.render('learn/index');
});

module.exports = router;
