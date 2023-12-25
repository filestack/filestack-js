const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const merge = require('lodash.merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const banner = fs.readFileSync('./LICENSE', 'utf8').replace('{year}', new Date().getFullYear());
const nodeExternals = require('webpack-node-externals');

const config =  {
  mode: 'production',
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './build/module/index.js',
  output: {
    library: {
      type: 'umd',
    },
    path: path.resolve(__dirname, 'build/browser'),
    filename: 'filestack.umd.js',
  },
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
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.BannerPlugin({ banner }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '@{VERSION}' : JSON.stringify(`${require('./package.json').version}`),
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
          case "buffer":
             resource.request = "buffer";
             break;
          case "stream":
             resource.request = "readable-stream";
             break;
          default:
             throw new Error(`Not found ${mod}`);
      }
  }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      process: require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve('crypto-browserify'),
      fs: require.resolve('browserify-fs'),
      path: require.resolve('path-browserify'),
    },
  },
};

const umd = merge({}, config, {
  output: {
    library: {
      type: 'umd',
    },
    filename: 'filestack.umd.js',
  },
});

const esm = merge({}, config, {
  output: {
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
});

const prod = merge({}, config,  {
  output: {
    library: {
      type: 'umd',
    },
    filename: 'filestack.min.js',
  },
  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
      integrity: true,
    }),
  ],
});

const ext = merge({}, config,{
  externals: [nodeExternals()]
});

module.exports = { umd, esm, prod, ext };