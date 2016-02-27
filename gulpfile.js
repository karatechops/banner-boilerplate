var gulp            = require('gulp');
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var minifyCSS       = require('gulp-minify-css');
var fileinclude     = require('gulp-file-include');
var runSequence     = require('run-sequence');
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;

var workingFolder   = ['300x250'];
var folders         = ['300x250', '300x250-2']

gulp.task('html', function(){
  gulp.src(['./src/'+workingFolder[0]+'/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'+workingFolder[0]));
});

gulp.task('htmlAll', function(){
  folders.forEach(function(folder) {
    gulp.src(['./src/' + folder + '/index.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('./dist/' + folder));
  });
});

gulp.task('sass', function(){
  return gulp.src([
      'src/assets/scss/base.scss',
      'src/'+workingFolder[0]+'/app.scss'
    ])
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    .pipe(rename('app.css'))
    .pipe(gulp.dest('./dist/'+workingFolder[0]));
});

gulp.task('sassAll', function(){
  folders.forEach(function(folder) {
    return gulp.src([
        'src/assets/scss/base.scss',
        'src/' + folder + '/app.scss'
      ])
      .pipe(sass())
      .pipe(concat('app.css'))
      .pipe(minifyCSS())
      .pipe(rename('app.css'))
      .pipe(gulp.dest('./dist/' + folder));
  });
});

gulp.task('scripts', function() {
  return gulp.src(['src/assets/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'+workingFolder[0]));
});

gulp.task('scriptsAll', function() {
  folders.forEach(function(folder) {
    return gulp.src(['src/assets/js/app.js'])
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/'+folder));
  });
});

gulp.task('all', function(){
  folders.forEach(function(folder) {
    runSequence([
      'scriptsAll',
      'sassAll',
      'htmlAll'
    ]);
  });
});

gulp.task('serve', function () {

  browserSync.init({
    server: {
      baseDir: './dist/'+workingFolder[0]+'/'
    }
  });

  gulp.watch("./src/**/*.html", ['html']).on("change", browserSync.reload);
  gulp.watch(['./src/assets/js/**/*.js', './src/**/*.js'], ['scripts']).on("change", browserSync.reload);
  gulp.watch(['./src/assets/scss/**/*.scss', './src/**/*.scss'], ['sass']).on("change", browserSync.reload);

});

gulp.task('default', ['html', 'sass', 'scripts']);