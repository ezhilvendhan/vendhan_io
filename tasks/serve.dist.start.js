'use strict';

// -------------------------------------
//   Task: Serve
// -------------------------------------
const nodemon = require('gulp-nodemon');

module.exports = function() {
  return function() {
    nodemon({
        script: 'app.js',
        args: ['--dist'],
        env: { 'base-dir' : '/../public'}
      })
      .on('restart', function() {
        console.log('app.js restarted');
      });
  };
};
