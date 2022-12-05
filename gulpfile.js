const gulp = require('gulp');
const ts = require('gulp-typescript');
const terser = require('gulp-terser');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', () => {
  return gulp
    .src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(terser())
    .pipe(gulp.dest('dist'));
});
