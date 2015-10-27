module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      browserify: {
        command: 'browserify -r chai -r javascript-sandbox -r jshint -o ../../build/sandbox_vendor.js'
      }
    },
    concat: {
      '../../build/demos/javascript.js': ['../../build/sandbox_vendor.js', 'node_modules/mocha/mocha.js', '../../../dist/reporter.js']
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['shell:browserify', 'concat']);
};
