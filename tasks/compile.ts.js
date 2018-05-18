'user strict'

const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp) {
  const TS_SRC = ['public/**/*.ts', '!public/bower_components/**/*.ts'];
  return function() {
    let tsProject = ts.createProject('tsconfig.json');
    return gulp.src(TS_SRC)
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(rename(path => {
        const oldName = path.basename;
        path.basename = path.basename + '.es5';
        console.log(`Compiling ${oldName}.ts -> ${path.basename}.js`)
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public'));
    }
};
