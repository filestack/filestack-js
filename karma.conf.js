require('dotenv').config();
const rollupConfig = require('./rollup.config.js');

module.exports = function karmaConfig(config) {
  config.set({
    singleRun: true,
    failOnEmptyTestSuite: false,
    frameworks: ['browserify', 'mocha'],
    reporters: ['progress'],
    browserify: {
      debug: true,
      transform: [
        'envify',
      ],
    },
    rollupPreprocessor: Object.assign({}, rollupConfig, {
      output: {
        format: 'umd',
        sourcemap: false,
      },
    }),
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      timeout: 600,
      forcelocal: true,
    },
    customLaunchers: {
      bs_ie11: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'IE',
        browser_version: '11.0',
        resolution: '1024x768',
      },
      bs_chrome_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Chrome',
        browser_version: '57.0',
        resolution: '800x600',
      },
      bs_firefox_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Firefox',
        browser_version: '52.0',
        resolution: '1024x768',
      },
      bs_edge_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Edge',
        browser_version: '14.0',
        resolution: '1024x768',
      },
      bs_safari_osx_sierra: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Sierra',
        browser: 'Safari',
        browser_version: '10.0',
        resolution: '1024x768',
      },
      bs_safari_osx_stable: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Mojave',
        browser: 'Safari',
        browser_version: '12',
        resolution: '1024x768',
      },
      bs_iphone6: {
        base: 'BrowserStack',
        device: 'iPhone 6',
        os: 'ios',
        os_version: '8.3',
      },
      electron: {
        base: 'Electron',
        // flags: ['--show'],
      },
    },
    browsers: process.env.CI ? [
      // 'bs_ie11',
      // 'bs_safari_osx_stable',// for now disabled, need to firgure out whats happend (timeouted)
      'bs_chrome_windows',
      'bs_firefox_windows',
      'bs_edge_windows'
    ] : [
      'electron',
    ],
    browserNoActivityTimeout: 2 * 600000,

    files: [
      'https://cdn.polyfill.io/v2/polyfill.js',
      'test/setup.js',
      'build/module/**/*.spec.js',
    ],

    preprocessors: {
      'test/setup.js': ['browserify'],
      'build/module/**/*.spec.js': ['rollup'],
    },

    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',
      },
    },
  });
};
