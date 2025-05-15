const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const merge = require('lodash.merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { SourceMapConsumer } = require('source-map');
const banner = fs.readFileSync('./LICENSE', 'utf8').replace('{year}', new Date().getFullYear());

const baseConfig = {
  mode: 'production',
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './build/module/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /^.*\.node\.js|.*\.node\.spec\.js|.*\.browser\.spec\.js|.*\.spec\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead, ie 11',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 255000,
    maxAssetSize: 255000
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap('SourceMapInit', () => {
          SourceMapConsumer.initialize({
            'lib/mappings.wasm': path.resolve(
              path.dirname(require.resolve('source-map')),
              'lib',
              'mappings.wasm'
            )
          });
        });
      }
    },
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.BannerPlugin({ banner }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '@{VERSION}': JSON.stringify(`${require('./package.json').version}`),
    }),
    new webpack.NormalModuleReplacementPlugin(/\.node$/, (resource) => {
      resource.request = resource.request.replace(/\.node$/, '.browser');
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
      'process/browser': require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url"),
    },
  },
};

const webpackConfigs = {
  umd: merge({}, baseConfig, {
    output: {
      path: path.resolve(__dirname, 'build/browser'),
      filename: 'filestack.umd.js',
      library: 'filestack',
      libraryTarget: 'umd',
    },
  }),

  esm: merge({}, baseConfig, {
    output: {
      path: path.resolve(__dirname, 'build/browser'),
      filename: 'filestack.esm.js',
      library: {
        type: 'module',
      },
      environment: {
        module: true,
      },
      module: true,
    },
    experiments: {
      outputModule: true,
    },
  }),

  prod: merge({}, baseConfig, {
    output: {
      path: path.resolve(__dirname, 'build/browser'),
      filename: 'filestack.min.js',
      library: 'filestack',
      libraryTarget: 'umd'
    },
    plugins: [
      new WebpackAssetsManifest({
        writeToDisk: true,
        integrity: true,
        output: 'manifest.json',
      }),
    ],
  })
};

module.exports = webpackConfigs;
