'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');

const bump = require('gulp-bump');
const bower = require('gulp-bower');

const imagemin = require('gulp-imagemin');

var dev = process.argv.indexOf('--dist') < 0;

// -----------------------------------------------------------------------------
// getTask() loads external gulp task script functions by filename
// -----------------------------------------------------------------------------
function getTask(task) {
	return require('./tasks/' + task)(gulp, plugins);
}

// -----------------------------------------------------------------------------
// Task: Compile : Scripts, Sass, EJS, All
// -----------------------------------------------------------------------------
gulp.task('compile:sass', getTask('compile.sass'));
gulp.task('compile:index', ['compile:sass'], getTask('compile.index'));

// -----------------------------------------------------------------------------
// Task: Serve : Start
// -----------------------------------------------------------------------------
gulp.task('serve:dev:start', ['transpile:scripts', 'compile:typescript'], getTask('serve.dev.start'));
gulp.task('serve:dist:start', ['dist'], getTask('serve.dist.start'));

// -----------------------------------------------------------------------------
// Task: Watch : Source, Public, All
// -----------------------------------------------------------------------------
gulp.task('watch:public', getTask('watch.public'));

// -----------------------------------------------------------------------------
// Task: Dist (Build app ready for deployment)
// 	clean, compile:sass, compile:index, copy, bundle
// -----------------------------------------------------------------------------
gulp.task('dist', ['dist:copy', 'transpile:scripts', 'compile:typescript'], getTask('compile.polymer'));

// -----------------------------------------------------------------------------
// Task: Dist : Copy source files for deploy to dist/
// -----------------------------------------------------------------------------
gulp.task('dist:copy', ['dist:clean', 'compile:index'], getTask('dist.copy'));

// -----------------------------------------------------------------------------
// Task: Dist : Clean 'dist/'' folder
// -----------------------------------------------------------------------------
gulp.task('dist:clean', getTask('dist.clean'));

// -----------------------------------------------------------------------------
// Task: Transpile : Convert between EcmaScript Versions
// -----------------------------------------------------------------------------
gulp.task('transpile:scripts', getTask('transpile.scripts'));

// -----------------------------------------------------------------------------
// Task: Compile TS : Convert Typescript to Ecmascript
// -----------------------------------------------------------------------------
gulp.task('compile:typescript', getTask('compile.ts'));

// -----------------------------------------------------------------------------
// Task: Bump : Bumps project version
// -----------------------------------------------------------------------------
gulp.task('bump:patch', function(){
	gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
	gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function(){
	gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type:'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('image-min', () =>
    gulp.src('./public/resources/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./public/resources'))
);

// -----------------------------------------------------------------------------
//  Task: Default (compile source, start server, watch for changes)
// -----------------------------------------------------------------------------
gulp.task('default', function (cb) {
	gulpSequence('compile:index', (dev ? 'serve:dev:start' : 'serve:dist:start'), 'watch:public')(cb);
});
