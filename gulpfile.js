var source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    server = require('gulp-express'),
    babel = require('gulp-babel'),
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

gulp.task('babelify', function() {
  return gulp.src('public/src/app.js')
  	.pipe(babel({
  		presets: ['es2015']
  	}))
    .pipe(streamify(uglify()))
    .pipe(rename('bundle.js'))
  	.pipe(gulp.dest('public/dist'));
});

gulp.task('default', ['babelify', 'sass'], function() {
  server.run(['server.js']);

  gulp.watch('./public/src/**/*.js', ['babelify']);
  gulp.watch(['./public/sass/**/*.scss'], ['sass']);
});

gulp.task('build', ['lint', 'babelify', 'sass']);
