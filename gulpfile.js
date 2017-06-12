const gulp = require('gulp')
const shell = require('gulp-shell')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')

gulp.task('run-server', shell.task([
  'nodemon index.js'
]))

gulp.task('minify-css', () => {
  return gulp.src('public/content/styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/content/styles'))
})
