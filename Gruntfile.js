module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.initConfig({
    qunit: {
      all: ['test/*.html']
    },
    jshint: {
      all: ['Gruntfile.js', 'js/*.js']
    },
    sass: {
      dist: {
        files: {
          'css/style.css': 'sass/style.sass'
        }
      }
    },
   connect: {
     server: {
       options: {
         port: 3000,
         keepalive: true
       }
     }
   },
    watch: {
      scripts: {
        files: 'sass/*.sass',
        tasks: ['sass'],
        options: {
          interrupt: true,
          livereload: true
        }
      }
    },
    uglify: {
      build: {
        files: {
          'dist/app.js': ['js/lib/jquery.min.js', 'js/accordion.js']
        }
      }
    },
    concurrent: {
      test: ['jshint', 'qunit']
    }
  });

  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('test', ['concurrent:test']);
  grunt.registerTask('build', ['test', 'sass', 'uglify']);

};
