const gulp = require('gulp');
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const del = require('del');
const version = require('../package.json').version;
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const webpackCfg = require('./../webpack.config.js') ;

const WEBPACK_DEST = 'build/browser';

gulp.task('build:clean', function () {
  return del([
    'build/**/*'
  ]);
});

gulp.task('typescript:main', () => {
  const tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(replace('@{VERSION}', version))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/main'));
});

gulp.task('typescript:modules', () => {
  const tsProject = ts.createProject('tsconfig.module.json');
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(replace('@{VERSION}', version))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/module'));
});

gulp.task('build:webpack:umd', () => {
  const conf = webpackCfg.umd;
  return gulp.src(conf.entry)
  .pipe(webpack(conf))
  .pipe(gulp.dest(conf.output.path));
});

gulp.task('build:webpack:esm', () => {
  const conf = webpackCfg.esm;

  return gulp.src(conf.entry)
  .pipe(webpack(conf))
  .pipe(gulp.dest(conf.output.path));
});

gulp.task('build:webpack:prod', () => {
  const conf = webpackCfg.prod;

  return gulp.src(conf.entry)
  .pipe(webpack(conf))
  .pipe(gulp.dest(conf.output.path));
});

gulp.task('build:webpack', gulp.series(['build:webpack:umd', 'build:webpack:esm', 'build:webpack:prod']));

gulp.task('build:typescript', gulp.series(['build:clean', 'typescript:main', 'typescript:modules']));

gulp.task('build', gulp.series(['build:typescript', 'build:webpack']));
