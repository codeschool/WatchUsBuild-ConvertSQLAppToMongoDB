var express = require('express');
var router  = express.Router();
var path    = require('path');
var Course  = require(path.join(__dirname, '..', 'services', 'course'));

router
  .get('/list.json', function(req, res) {
    res.json(Course.all());
  })
  .get('/:id.json', function(req, res) {
    var course = Course.find(req.params.id);

    if (course.error) {
      res.status(404).json(course);
    } else {
      res.json(course);
    }
  })
  .get('/:id/challenges.json', function(req, res) {
    var course = Course.find(req.params.id);

    if (course.error) {
      res.status(404).json(course);
    } else {
      course.challenges[0].active = true;
      course.challenges[0].started = true;
      res.json(course.challenges);
    }
  });

module.exports = router;
