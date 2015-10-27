var express = require('express');
var router = express.Router();

/* GET /feedback page */
router.get('/', function(req, res) {
  res.render('feedback/index');
});

/* GET /feedback/success page */
router.get('/success', function(req, res) {
  res.render('feedback/success');
});

module.exports = router;
