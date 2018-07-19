const alias = require('rollup-plugin-alias');
const builtins = require('rollup-plugin-node-builtins');
const commonjs = require('rollup-plugin-commonjs');
const globals = require('rollup-plugin-node-globals');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const version = require('./package.json').version;

const adapters = {
  './lib/api/security': 'build/module/adapters/security.browser.js',
  './file_utils': 'build/module/adapters/file_utils.browser.js',
};

const namedExports = {
  'node_modules/tcomb-validation/index.js': [
    'Boolean',
    'Function',
    'Integer',
    'Number',
    'String',
    'enums',
    'refinement',
    'union',
    'tuple',
    'struct',
    'validate',
    'maybe',
    'list'
  ],
  'node_modules/superagent/lib/client.js': [
    'get',
    'post',
    'put',
    'delete',
    'head'
  ],
  'node_modules/bowser/src/bowser.js': [ 'mobile' ],
  'node_modules/spark-md5/spark-md5.js': [ 'ArrayBuffer' ]
};

const plugins = [
  alias(adapters),
  nodeResolve({
    browser: true,
    preferBuiltins: true,
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: namedExports,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.TEST_ENV': JSON.stringify(process.env.TEST_ENV),
  }),
];

// We use Node style testing so the Karma bundle needs some Node globals
if (process.env.TEST_ENV) {
  plugins.push(builtins());
  plugins.push(globals());
}

module.exports = {
  input: 'build/module/index.js',
  onwarn: function(warning) {
    // Skip certain warnings
    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    // console.warn everything else
    console.warn( warning.message );
  },
  plugins
};
