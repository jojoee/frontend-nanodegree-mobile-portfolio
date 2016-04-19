var gulp          = require('gulp');
var notify        = require('gulp-notify');
var rename        = require('gulp-rename');
var htmlmin       = require('gulp-htmlmin');
var inlinesource  = require('gulp-inline-source');
var browserSync   = require('browser-sync').create();

/*================================================================
 # HELPER
 ================================================================*/

function handleError(err) {
  var msg = 'Error: ' + err.message;

  console.error('Error', err.message);
  browserSync.notify('Error: ' + err.message);

  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end')
}

/*================================================================
 # TASK
 ================================================================*/

gulp.task('html', function() {
  return gulp.src('./index.html')
    .pipe(rename({suffix: '.min'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(inlinesource())
    .pipe(gulp.dest(''))
    .pipe(browserSync.stream({
      'once': true
    }));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  
  gulp.watch('./index.html', ['html']);
  gulp.watch('./css/**/*.css', ['html']);
  gulp.watch('./js/**/*.js', ['html']);
});

var allTasks = [
  'html',
  'serve'
];
gulp.task('all', allTasks);
gulp.task('default', ['serve']);
