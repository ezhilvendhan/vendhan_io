'use strict';

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  refresh = require('gulp-livereload'),
  minifyCSS = require('gulp-minify-css'),
  compass = require('gulp-compass'),
  jshint = require('gulp-jshint'),
  imagemin = require('gulp-imagemin'),
  runSequence = require('gulp-run-sequence')(gulp),
  clean = require('gulp-clean'),
  lr = require('tiny-lr'),
  server = lr(),
  open = require('gulp-open'),
  path = require('path')

gulp.task('clean', function () {
  gulp.src('public')
    .pipe(clean())
})

gulp.task('copyStatic', function () {
  gulp.src('app/*.*')
    .pipe(gulp.dest('public'))
    .pipe(refresh(server))
})

gulp.task('copyDemo', function () {
  gulp.src('app/demo')
    .pipe(gulp.dest('public'))
    .pipe(refresh(server))
})

gulp.task('optimize', function () {
  gulp.src('app/images/*.{png, jpg, gif}')
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true
    }))
    .pipe(gulp.dest('public/images'))
    .pipe(refresh(server))
})

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})
gulp.task('scripts', function() {
  gulp.run('lint')
  gulp.src('app/scripts/*.js')
      .pipe(browserify())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('public/scripts'))
      .pipe(refresh(server))
})

gulp.task('compass', function () {
  gulp.src('app/styles/*.scss')
    .pipe(compass({
        config_file: 'app/styles/config.rb'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/styles'))
    .pipe(refresh(server))
})

gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if(err) return console.error(err)
    nodemon({ script: 'server.js',
        options: '--harmony --watch server.js --watch lib/**/*.js' })
      .on('restart', 'lint')
    gulp.src('./views/index.html')
      .pipe(open('', {url: "http://localhost:3000"}))
  })
})

gulp.task('watch', function() {
  gulp.watch('views/**/*.html', function(event) {
    gulp.run('lr-server')
  })
  gulp.watch('app/scripts/**', function(event) {
    gulp.run('scripts')
    gulp.run('lr-server')
  })
  gulp.watch('app/styles/**/*.scss', function(event) {
    gulp.run('compass')
    gulp.run('lr-server')
  })
})

gulp.task('default', function() {
  runSequence('optimize', 'copyStatic', 'scripts',
              'compass', 'copyDemo', 'lr-server', 'watch')
})

gulp.task('serve', function() {
  runSequence('copyStatic', 'scripts',
              'compass', 'copyDemo', 'lr-server', 'watch')
})