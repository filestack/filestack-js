const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const merge = require('lodash.merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const banner = fs.readFileSync('./LICENSE', 'utf8').replace('{year}', new Date().getFullYear());

const config =  {
  mode: 'production',
  node: { Buffer: false },
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './build/module/index.js',
  output: {
    libraryTarget: 'umd',
    library: 'filestack',
    path: path.resolve(__dirname, 'build/browser'),
    filename: 'filestack.umd.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
  externals: [
    // those externals are only used in nodejs
    'fs',
    'path',
    'crypto',
  ],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({ banner }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production',
      '@{VERSION}' : `${require("./package.json").version}`,
    }),
  ],
  devtool: 'source-map',
};

const umd = merge({}, config, {
  output: {
    libraryTarget: 'umd',
    filename: 'filestack.umd.js',
  },
});

const esm = merge({}, config, {
  output: {
    libraryTarget: 'var',
    filename: 'filestack.esm.js',
  },
  plugins: [
    new EsmWebpackPlugin(),
  ]
});

const prod = merge({}, config,  {
  output: {
    libraryTarget: 'umd',
    filename: 'filestack.min.js',
  },
  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
      integrity: true,
    }),
  ],
});

module.exports = [umd, esm, prod];
