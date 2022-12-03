var gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

gulp.task('default', () => {
  return gulp
    .src('src/**/*.ts')
    .pipe(ts())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
