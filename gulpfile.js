// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
//   Modules
// -------------------------------------

// ----- Gulp ----- //

var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cheerio      = require('gulp-cheerio');
var concat       = require('gulp-concat');
var minifycss    = require('gulp-minify-css');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var shell        = require('gulp-shell');
var svgmin       = require('gulp-svgmin');
var svgstore     = require('gulp-svgstore');
var uglify       = require('gulp-uglify');
var watch        = require('gulp-watch');

// ----- NPM ----- //

var _            = require('lodash');
var run          = require('run-sequence');
var Chance       = require('chance');

// -------------------------------------
//   Variables
// -------------------------------------

var options = {

  build: {
    tasks: ['sass', 'abecedary', 'javascript', 'icons']
  },

  css: {
    file: 'public/stylesheets/application.css',
    destination: 'public/stylesheets'
  },

  sass: {
    files: [
      'client/stylesheets/*.{sass,scss}',
      'client/stylesheets/**/*.{sass,scss}'
    ],
    destination: 'public/stylesheets'
  },

  js: {
    files: [
      'client/javascripts/application.js',
      'client/javascripts/**/*.js'
    ],
    vendorFiles: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/js/tooltip.js',
      'bower_components/autosize/dist/autosize.js'
    ],
    vendorCourseFiles: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/lodash/lodash.js',
      'bower_components/marked/marked.min.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/cs_console/dist/cs_console.js',
      'bower_components/abecedary/dist/abecedary.js',
    ],
    courseFiles: ['client/javascriptcom/**/*.js',],
    destFile: 'application.js',
    destVendorFile: 'vendor.js',
    destVendorCourseFile: 'vendor-course.js',
    destCourseFile: 'course.js',
    destDir: 'public/javascripts'
  },

  browserify: {
    files: ['chai',
            'javascript-sandbox',
            'jshint',
            './courses/helper/index.js'
    ],
    destFile: 'vendor.js',
    destDir:  'bower_components/abecedary/dist'
  },

  abecedary: {
    files: [
      'bower_components/abecedary/dist/vendor.js',
      'node_modules/mocha/mocha.js',
      'bower_components/abecedary/dist/reporter.js',
    ],
    destFile: 'abecedary-javascript-com.js',
    destDir:  'public/javascripts'
  },

  icons: {
    files: 'public/images/icons/icon-*.svg',
    destDir: 'public/images/icons'
  }

};


// -------------------------------------
//   Task: build
// -------------------------------------

gulp.task('build', function() {
  run(options.build.tasks);
});

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task('default', function() {
  watch(options.sass.files, function(files) {
    gulp.start('sass');
  });

  watch(options.js.files, function(files) {
    gulp.start('javascript');
  });
  watch(options.js.courseFiles, function(files) {
    gulp.start('javascript');
  });

  watch(options.icons.files, function(files) {
    gulp.start('icons');
  });

  watch(options.browserify.files, function(files) {
    gulp.start('browserify');
  });

  watch(options.abecedary.files, function(files) {
    gulp.start('abecedary');
  });
});

// -------------------------------------
//   Task: CSS Minify
// -------------------------------------

gulp.task('minify-css', function () {
  gulp.src(options.css.file)
      .pipe(minifycss({ advanced: false }))
      .on('error', function(error) { console.log(error.message); })
      .pipe(gulp.dest(options.css.destination));
});

// -------------------------------------
//   Task: Sass
// -------------------------------------

gulp.task('sass', function () {
  gulp.src(options.sass.files)
      .pipe(sass({ indentedSyntax: true }))
      .on('error', function(error) { console.log(error.message); })
      .pipe(autoprefixer({
        browsers: [ 'last 2 versions', 'Explorer >= 9' ],
        cascade: false
      }))
      .pipe(gulp.dest(options.sass.destination));
});

// -------------------------------------
//   Task: Browserify
// -------------------------------------

gulp.task('browserify', function() {
  var files = _.collect(options.browserify.files, function(file) {
    return '-r ' + file;
  }).join(' ');

  var output = options.browserify.destDir + '/' + options.browserify.destFile;

  return gulp.task('browserify', shell.task(['node_modules/browserify/bin/cmd.js '+files+' -o ' + output]));
});

// -------------------------------------
//   Task: Abecedary
// -------------------------------------

gulp.task('abecedary', ['browserify'], function() {
  // Combine the non-browserified files and the browserified ones
  // to create the runner script, included in the test iframe.
  gulp.src(options.abecedary.files)
    .pipe(concat(options.abecedary.destFile))
    .pipe(gulp.dest(options.abecedary.destDir));
});

// -------------------------------------
//   Task: JavaScript
// -------------------------------------

gulp.task('javascript', function() {
  // application.js
  gulp.src(options.js.files)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destFile))
    .pipe(gulp.dest(options.js.destDir));

  // vendor.js
  gulp.src(options.js.vendorFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destVendorFile))
    .pipe(gulp.dest(options.js.destDir));

  // vendor-course.js
  gulp.src(options.js.vendorCourseFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destVendorCourseFile))
    .pipe(gulp.dest(options.js.destDir));

  // course.js
  gulp.src(options.js.courseFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destCourseFile))
    .pipe(gulp.dest(options.js.destDir));
});

// -------------------------------------
//   Task: Icons
// -------------------------------------

gulp.task('icons', function() {
  gulp.src(options.icons.files)
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function($) {
      $('title').remove();
      $('[fill]').removeAttr('fill');
      $('[opacity]').removeAttr('opacity');
      $('[title]').removeAttr('title');
      $('[xmlns]').removeAttr('xmlns');
    }))
    .pipe(gulp.dest(options.icons.destDir));
});

