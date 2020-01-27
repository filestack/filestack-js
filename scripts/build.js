const gulp = require('gulp');
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const del = require('del');
const version = require('../package.json').version;

gulp.task('build:clean', function () {
  return del([
    'build/**/*'
  ]);
});

gulp.task('typescript:main', () => {
  const tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(tsProject())
    .pipe(replace('@{VERSION}', version))
    .pipe(gulp.dest('build/main'));
});

gulp.task('typescript:modules', () => {
  const tsProject = ts.createProject('tsconfig.module.json');
  return tsProject.src()
    .pipe(tsProject())
    .pipe(replace('@{VERSION}', version))
    .pipe(gulp.dest('build/module'));
});

gulp.task('build:typescript', gulp.series(['build:clean', 'typescript:main', 'typescript:modules']));

gulp.task('build', gulp.series(['build:typescript']));
