var source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    server = require('gulp-express'),
    gulp = require('gulp');

gulp.task('lint', function() {
  return gulp.src(['public/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('sass', function() {
  return gulp.src('./public/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('browserify', function() {
  var bundleStream = browserify('./public/src/app.js').bundle();

  bundleStream
    .pipe(source('./public/src/app.js'))
    .pipe(streamify(uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', ['browserify', 'sass'], function() {
  server.run(['server.js']);

  gulp.watch('./public/src/**/*.js', ['browserify']);
  gulp.watch(['./public/sass/**/*.scss'], ['sass']);
});

gulp.task('build', ['lint', 'browserify', 'sass']);
