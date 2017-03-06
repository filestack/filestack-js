/* eslint-disable no-console */
// Build for filestack.js published to npm

import jetpack from 'fs-jetpack';
import minimist from 'minimist';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import inject from 'rollup-plugin-inject';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

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
  entry: 'lib/filestack.js',
  acorn: {
    allowReserved: true,
  },
  onwarn(warning) {
    // Suppress this error message
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    console.error(warning.message);
  },
  plugins: [
    inject({
      exclude: 'node_modules/**',
      modules: {
        ENV: jetpack.path(`config/env_${envName}.js`),
      },
    }),
    replace({
      delimiters: ['@{', '}'],
      values: {
        VERSION: manifest.version,
      },
    }),
    nodeResolve(),
    commonJs(),
    babel(babelrc()),
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
