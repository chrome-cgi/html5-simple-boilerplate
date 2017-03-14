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
  return gulp.src(bases.dist + '**/*')
    .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('js', function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(bases.dist + 'js/'))
    .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', function() {
  gulp.src(paths.imgs)
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'img/'))
    .pipe(browserSync.stream());
});

// Copy all other files to dist directly
gulp.task('copy', function() {
  // Copy html
  gulp.src(paths.html)
    .pipe(gulp.dest(bases.dist))
    .pipe(browserSync.stream());
});

gulp.task('build', ['clean', 'js', 'sass', 'imagemin', 'copy'])

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: bases.dist
  });

  gulp.watch(paths.sass, ['sass']);
  gulp.watch(bases.src + "js/**/*", ['js']);
  gulp.watch(bases.src + 'img/**/*', ['imagemin']);
  gulp.watch(bases.src + '**/*.html', ['copy']);
});

gulp.task('default', ['serve']);
