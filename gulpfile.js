var sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    server = require('gulp-express'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babel = require('babelify'),
    gulp = require('gulp');


gulp.task('sass', function() {
  return gulp.src('./public/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/dist/'));
});

function compile(watch) {
  var bundler = watchify(browserify('./public/src/app.js', { debug: true }).transform(babel.configure({presets: ["es2015"]})));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/dist'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};
gulp.task('vendor', function() {
    return gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
    ])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./public/dist'))
});

gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch', 'sass', 'vendor'], function() {
  server.run(['server.js']);

  gulp.watch(['./public/sass/**/*.scss'], ['sass']);
});

gulp.task('build', ['sass', 'vendor']);
