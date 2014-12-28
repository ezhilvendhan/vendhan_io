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
  runSequence = require('run-sequence'),
  clean = require('del'),
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
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
    .pipe(refresh(server))
})

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})
gulp.task('scripts', function() {
  gulp.watch('app/scripts/*.js', ['lint'])
  gulp.src('app/scripts/*.js')
      .pipe(browserify())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('public/scripts'))
      .pipe(refresh(server))
})

gulp.task('styles', function () {
  var compass_options = {
    config_file: 'app/styles/config.rb',
    css: 'app/styles',
    sass: 'app/styles',
    debug: true,
    sourcemap: true
  }
  gulp.src('app/styles/**/*.scss')
    .pipe(compass(compass_options))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/styles'))
    .pipe(refresh(server))
  gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('public/fonts'))
    .pipe(refresh(server))
})

gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if(err) return console.error(err)
    nodemon({ script: 'server.js',
        nodeArgs: ['--harmony'],
        options: '--harmony --watch server.js --watch lib/**/*.js' })
      .on('restart', 'lint')
    gulp.src('./views/index.html')
      .pipe(open('', {url: "http://localhost:3000"}))
  })
})

gulp.task('watch', function() {
  gulp.watch('views/**/*.html', function(event) {
    refresh(server)
    gulp.run('lr-server')
  })
  gulp.watch('app/scripts/**', ['scripts','lr-server'])
  gulp.watch('app/styles/**/*.scss', ['styles','lr-server'])
})

gulp.task('default', function() {
  runSequence('optimize', 'copyStatic', 'scripts',
              'styles', 'copyDemo', 'lr-server', 'watch')
})

gulp.task('serve', function() {
  runSequence('copyStatic', 'scripts',
              'styles', 'copyDemo', 'lr-server', 'watch')
})
