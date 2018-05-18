'use strict';

// -------------------------------------
//   Task: Watch: Public
// -------------------------------------
const ES6_SRC = ['public/**/*.es6.js', '!public/bower_components/**/*.es6.js'];
const TS_SRC = ['public/**/*.ts', '!public/bower_components/**/*.ts'];
module.exports = function(gulp) {
  return function() {
    gulp.watch(ES6_SRC, ['transpile:scripts']);
    gulp.watch(TS_SRC, ['compile:typescript']);
    gulp.watch(['public/elements/**/*.scss', 'public/*.scss'], ['compile:sass']);
    gulp.watch(['./public/_index.html','./public/_index-inline-loading-script.js','./public/index-inline.scss'],
    ['compile:index']);
  };
};
