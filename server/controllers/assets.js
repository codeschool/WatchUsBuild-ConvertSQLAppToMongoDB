var express = require('express');
var router = express.Router();

/* GET /assets page */
router.get('/', function(req, res) {
  res.render('assets/index');
});

module.exports = router;
