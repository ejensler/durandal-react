var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('serve', function() {
  var opts = {
    root: 'example',
    expressPort: 4000,
  };

  // Create express server
  var express = require('express');
  var app = express();
  app.use(express.static(opts.root));
  app.listen(opts.expressPort);
});

gulp.task('default', ['serve']);