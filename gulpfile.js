var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var notify = require("gulp-notify");

var appPath = './app/js/App.jsx';
var outPath = './app/build/';

function buildScript(file, watch) {
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
      }))
      .pipe(source('App.jsx'))
      .pipe(gulp.dest(outPath))
      .pipe(notify("Rebundled.."));
  }

  var bundler = browserify({
    entries: [file],
    extensions: ['.jsx', '.jsx'],
    debug: true,
    fullPaths: true
  }).transform(babelify.configure({
    presets: ['es2015', 'react']
  }));

  if (watch) {
    watchify(bundler);
  }

  return rebundle();
}

gulp.task('build', function() {
  return buildScript(appPath, false);
});

gulp.task('watch', function() {
  return buildScript(appPath, true);
});

gulp.task('default', ['build'], function() {
  return buildScript('main.js', true);
});