module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      browserify: {
        command: 'browserify -s Abecedary -t decomponentify -t brfs index.js > dist/abecedary.js'
      }
    },
    watch: {
      scripts: {
        files: ['index.js', 'lib/runner.js'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['shell:browserify']);
  grunt.registerTask('w', ['watch']);
};
