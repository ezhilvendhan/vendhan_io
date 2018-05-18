'use strict';

// -------------------------------------
//   Task: Transpile: ES6 Code to ES5
// -------------------------------------

/* Used to transpile JavaScript */
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const cache = require('gulp-cached');

// Globbing pattern to find ES6 source files that need to be transpiled
const ES6_SRC = ['public/**/*.es6.js', '!public/bower_components/**/*.es6.js'];
// Output directory for transpiled files
const ES5_DEST = './public';

module.exports = function(gulp) {
  return function() {
    return gulp.src(ES6_SRC)
      .pipe(cache('transpiling'))
      .pipe(sourcemaps.init())
      .pipe(babel({
        comments: false
      }))
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(rename(path => {
        const oldName = path.basename;
        path.basename = path.basename.replace('.es6', '.es5');
        console.log(`Transpiling ${oldName}.js -> ${path.basename}.js`)
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(ES5_DEST));
  };
};
