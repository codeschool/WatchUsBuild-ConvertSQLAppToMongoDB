var express = require('express');
var router = express.Router();

/* GET /notFound page */
router.get('/', function(req, res) {
  res.render('notFound/index');
});

module.exports = router;
