var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();
var fs = require('fs');
var runSequence = require('run-sequence');


gulp.task('test', ['lint'], function() {
  return gulp.src('./test/index.html').pipe(tasks.qunit());
});

gulp.task('sass', function() {
  return gulp.src('sass/style.sass')
    .pipe(tasks.rubySass({style: 'compressed'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(tasks.livereload({
      auto: false
    }));
});

gulp.task('connect', function() {
  tasks.connect.server({
    root: 'dist',
    port: 3000
  });
});

gulp.task('watch', function() {
  tasks.livereload.listen();
  gulp.watch('sass/*.sass', ['sass']);
});


gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(tasks.jshint())
    .pipe(tasks.jshint.reporter('default'))
    .pipe(tasks.jshint.reporter('fail'));
});

gulp.task('uglify', function() {
  return gulp.src(['./js/lib/jquery.min.js', './js/*.js'])
    .pipe(tasks.concat('dist/js/app.js'))
    .pipe(tasks.uglify())
    .pipe(gulp.dest(''));
});


gulp.task('copy', function() {
  gulp.src('index.html')
    .pipe(gulp.dest('./dist/'));

   gulp.src('./img/doge.jpg')
    .pipe(gulp.dest('./dist/img'));
});;

gulp.task('replace', function () {
  return gulp.src('dist/index.html')
  .pipe(tasks.replaceTask({
    patterns: [
      {
        match: 'css',
        replacement: fs.readFileSync('./dist/css/style.css', 'utf8')
      },
      {
        match: 'js',
        replacement: fs.readFileSync('./dist/js/app.js', 'utf8')
      }
    ]
  }))
  .pipe(gulp.dest('dist'));
});


gulp.task('htmlmin', function() {
  return gulp.src('./dist/index.html')
  .pipe(tasks.htmlmin({collapseWhitespace: true, removeComments: true}))
  .pipe(gulp.dest('./dist/'))
});


gulp.task('clean', function () {
  return gulp.src(['dist/js', 'dist/css'], {read: false})
    .pipe(tasks.clean());
});



gulp.task('prod', ['test', 'sass', 'uglify', 'copy', 'copyImg', 'replace'], function() {});

gulp.task('build', function() {
  runSequence(
    ['test', 'sass', 'uglify', 'copy'],
    'replace',
    ['htmlmin', 'clean']
  );
});
