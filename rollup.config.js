/* eslint-disable no-console */
// Build for filestack.js published to npm

import jetpack from 'fs-jetpack';
import minimist from 'minimist';
import babel from 'rollup-plugin-babel';
import inject from 'rollup-plugin-inject';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import uglify2 from 'uglify-js';

const argv = minimist(process.argv);
const envName = argv.env || 'production';
const manifest = jetpack.read('package.json', 'json');

const sourcemapType = () => {
  if (envName === 'production' || envName === 'staging') {
    // For production and staging sourcemaps are in separate file.
    return true;
  }
  // For debugging it's better to have sourcemaps in same file.
  return 'inline';
};

export default {
  entry: 'lib/index.js',
  acorn: {
    allowReserved: true,
  },
  plugins: [
    replace({
      delimiters: ['@{', '}'],
      values: {
        VERSION: manifest.version,
      },
    }),
    inject({
      exclude: 'node_modules/**',
      modules: {
        ENV: jetpack.path(`config/env_${envName}.js`),
      },
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonJs(),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({
      compress: false,
      mangle: false,
      output: {
        // Leave topmost comment with version
        comments: (node, comment) => comment.line === 1,
      },
    }, uglify2.minify),
  ],
  targets: [
    {
      dest: manifest.main,
      format: 'umd',
      banner: `/* v${manifest.version} */`,
      moduleName: 'filestack',
      sourceMap: sourcemapType(),
    },
    {
      dest: manifest.module,
      format: 'es',
      banner: `/* v${manifest.version} */`,
      sourceMap: sourcemapType(),
    },
  ],
};
