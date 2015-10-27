var express = require('express');
var router = express.Router();

/* GET /brand page */
router.get('/', function(req, res) {
  res.render('guidelines/index');
});

module.exports = router;
