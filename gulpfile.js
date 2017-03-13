var gulp = require('gulp');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var bases = {
  src: 'src/',
  dist: 'dist/',
};

var paths = {
  js: ['src/js/**/*.js'],
  sass: ['src/scss/**/*.scss'],
  imgs: ['src/img/**/*'],
  html: ['src/**/*.html']
}

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('js', ['clean'], function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(bases.dist + 'js/'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', ['clean'], function() {
  return gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  gulp.src(paths.imgs)
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'img/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy html
  gulp.src(paths.html)
    .pipe(gulp.dest(bases.dist));
});

gulp.task('build', ['clean', 'js', 'sass', 'imagemin', 'copy'])

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: bases.dist
  });

  gulp.watch(bases.src + '**/*', ['build'])
    .on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
