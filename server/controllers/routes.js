var express = require('express');
var router  = express.Router();
var path    = require('path');

// Other controllers
var about = require(path.join(__dirname,  'about'));
var assets = require(path.join(__dirname,  'assets'));
var courses = require(path.join(__dirname,  'courses'));
var feedback = require(path.join(__dirname,  'feedback'));
var guidelines = require(path.join(__dirname,  'guidelines'));
var index = require(path.join(__dirname,  'index'));
var learn = require(path.join(__dirname,  'learn'));
var news = require(path.join(__dirname,  'news'));
var notFound = require(path.join(__dirname,  'notFound'));
var resources = require(path.join(__dirname,  'resources'));
var sessions = require(path.join(__dirname,  'sessions'));
var styleguide = require(path.join(__dirname,  'styleguide'));
var users = require(path.join(__dirname,  'users'));

// Use the other controllers
router.use('/', index);
router.use('/about', about);
router.use('/assets', assets);
router.use('/courses', courses)
router.use('/courses.json', courses);
router.use('/feedback', feedback);
router.use('/guidelines', guidelines)
router.use('/news', news);
router.use('/resources', resources);
router.use('/sessions', sessions);
router.use('/styleguide', styleguide);
router.use('/try', learn);
router.use('/users', users);

module.exports = router;
