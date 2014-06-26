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
        options: {                       // Target options
          style: 'compressed'
        },
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
    replace: {
      prod: {
        options: {
          patterns: [
            {
              match: 'css',
              replacement: '<%= grunt.file.read("dist/css/style.css") %>'
            },
            {
              match: 'js',
              replacement: '<%= grunt.file.read("dist/js/app.js") %>'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist/'}
        ]
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: 'index.html', dest: 'dist/', filter: 'isFile'},
          {expand: true, src: 'img/doge.jpg', dest: 'dist/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('test', ['concurrent:test']);
  grunt.registerTask('build', ['test', 'sass', 'uglify','copy', 'replace:prod', 'htmlmin:prod']);
  grunt.registerTask('dev', ['injector:dev', 'htmlmin:dist']);
};
