var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('serve', function() {
  var express = require('express');
  var app = express();
  app.use('/example', express.static('example'));
  app.use('/src', express.static('src'));
  app.listen(4000);
});

gulp.task('default', ['serve']);