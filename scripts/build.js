const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const del = require('del');
const version = require('../package.json').version;
const rename = require('gulp-rename');
const gzip = require('gulp-gzip');

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

gulp.task('build:typescript', gulp.series(['typescript:main', 'typescript:modules']));

gulp.task('build', gulp.series(['build:clean', 'build:typescript']));

gulp.task('build:prod', gulp.series(['build:clean', 'build:typescript', () => {
  // return gulp.src(['build/browser/filestack.min.js'])
  // // .pipe(gzip({
  // //   preExtension: 'gz'
  // // }))
  // .pipe(gulp.dest('build/browser'));
}]));
