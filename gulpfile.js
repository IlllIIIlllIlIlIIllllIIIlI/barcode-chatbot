const gulp = require('gulp');
const ts = require('gulp-typescript');
const terser = require('gulp-terser');
const argv = require('minimist')(process.argv.slice(2));

const tsProject = ts.createProject('tsconfig.json');

const path = argv['t'] ? 'test' : 'dist';

gulp.task('default', () => {
  return gulp
    .src(['src/**/*.ts'])
    .pipe(tsProject())
    .pipe(terser())
    .pipe(gulp.dest(path));
});
