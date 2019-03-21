const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const uglifyEs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const betterRollup = require('gulp-better-rollup')
const del = require('del');
const rollupConfig = require('../rollup.config')
const version = require('../package.json').version;
const uglify = composer(uglifyEs);
const rename = require('gulp-rename');
const gzip = require('gulp-gzip');

// const debug = require('gulp-debug');
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

gulp.task('build:rollup', gulp.series('build:typescript', () => {
  return gulp.src('build/module/index.js')
    .pipe(sourcemaps.init())
    .pipe(betterRollup(rollupConfig, [{
      file: 'index.esm.js',
      format: 'es',
    }, {
      file: 'index.umd.js',
      name: 'filestack',
      format: 'umd',
    }]))
    .on('error', function (err) {
      console.log('Rollup error:', err)
    })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/browser'))
}));

gulp.task('build:uglify', gulp.series('build:rollup', () => {
  const uglifyOptions = {
    warnings: false,
    output: {
      preamble: fs.readFileSync(path.join(__dirname, '..', 'LICENSE')).toString('utf8').replace('${year}', new Date().getFullYear()),
    },
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
    },
  };

  return gulp.src(['build/browser/index.umd.js'])
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(uglify(uglifyOptions))
    .on('error', function (err) {
      console.log('Uglify error:', err)
    })
    .pipe(rename({ suffix: '.min', basename: 'filestack' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/browser'));
}));

gulp.task('build', gulp.series(['build:clean', 'build:rollup']));

gulp.task('build:prod', gulp.series(['build:clean', 'build:uglify', () => {
  return gulp.src(['build/browser/filestack.min.js'])
  .pipe(gzip({
    preExtension: 'gz'
  }))
  .pipe(gulp.dest('build/browser'));
}]));
