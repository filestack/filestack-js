/* eslint-disable no-console */
// Build for filestack.js published to CDN (embeddable via <script> tag)

import jetpack from 'fs-jetpack';
import minimist from 'minimist';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import inject from 'rollup-plugin-inject';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

const argv = minimist(process.argv);
const envName = argv.env || 'production';
const manifest = jetpack.read('package.json', 'json');

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
    uglify({
      output: {
        // Leave topmost comment with version
        comments: (node, comment) => comment.line === 1,
      },
    }),
  ],
  targets: [
    {
      dest: 'dist_cdn/filestack.js',
      format: 'umd',
      banner: `/* v${manifest.version} */`,
      moduleName: 'filestack',
      sourceMap: true,
    },
    {
      dest: `dist_cdn/filestack-${manifest.version}.js`,
      format: 'umd',
      banner: `/* v${manifest.version} */`,
      moduleName: 'filestack',
      sourceMap: true,
    },
  ],
};
