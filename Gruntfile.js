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
          'dist/css/style.css': 'sass/style.sass'
        }
      }
    },
   connect: {
     server: {
       options: {
         port: 3000,
         keepalive: true,
         base: 'dist'
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
          'dist/js/app.js': ['js/lib/jquery.min.js', 'js/accordion.js']
        }
      }
    },
    concurrent: {
      test: ['jshint', 'qunit']
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: false,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'indexMin.html': 'index.html',     // 'destination': 'source'
        }
      },
      prod: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },
    injector: {
      options: {
        ignorePath: 'dist'
      },
      dev: {
        files: {
          'index.html': ['js/lib/*.js','js/*.js', 'css/*.css'],
        }
      },
      prod: {
        files: {
          'dist/index.html': ['dist/js/*.js', 'dist/css/*.css']
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: 'index.html', dest: 'dist/', filter: 'isFile'},
        ]
      }
    }
  });

  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('test', ['concurrent:test']);
  grunt.registerTask('build', ['test', 'sass', 'uglify','copy', 'injector:prod', 'htmlmin:prod']);
  grunt.registerTask('dev', ['injector:dev', 'htmlmin:dist']);
};
