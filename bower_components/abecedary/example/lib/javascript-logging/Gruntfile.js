module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      browserify: {
        command: 'browserify -r sinon -r chai -r javascript-sandbox -r jshint -o ../../build/sandbox_vendor.js'
      }
    },
    concat: {
      '../../build/demos/javascript-logging.js': ['../../build/sandbox_vendor.js', 'node_modules/mocha/mocha.js', , '../../../dist/reporter.js']
    },
    watch: {
      scripts: {
        files: ['node_modules/abecedary/dist/reporter.js'],
        tasks: ['default']
      }
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['shell:browserify', 'concat']);
};
