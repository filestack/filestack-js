require('dotenv').config();
const rollupConfig = require('./rollup.config.js');

module.exports = function karmaConfig(config) {
  config.set({
    singleRun: true,
    concurrency: 2,
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
      timeout: 1800,
      forcelocal: true,
    },
    customLaunchers: {
      bs_edge_windows_latest: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Edge',
        browser_version: 'latest',
      },
      bs_safari_osx_latest: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: null,
        browser: 'Safari',
        browser_version: 'latest',
      },
      bs_iphone6: {
        base: 'BrowserStack',
        device: 'iPhone 6',
        os: 'ios',
        os_version: '8.3',
      },
      bs_ie11: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'ie',
        browser_version: '11',
        debug: true
      },
      electron: {
        base: 'Electron',
        // flags: ['--show'],
      },
      firefox_headless: {
        base: 'FirefoxHeadless',
      },
      chrome_headless: {
        base: 'Chrome',
        flags: [
            '--headless',
            '--disable-gpu',
            // Without a remote debugging port, Google Chrome exits immediately.
            '--remote-debugging-port=9222'
        ],
        debug: true
      }
    },
    browsers: process.env.CI ? [
      'bs_ie11',
      'chrome_headless',
      'bs_edge_windows_latest',
      'firefox_headless',
    ] : [
      // 'electron',
      // 'firefox_headless',
      // 'chrome_headless',
      'bs_ie11',
      'bs_edge_windows_latest',
    ],
    browserNoActivityTimeout: 2 * 600000,
    browserConsoleLogOptions: {
      level: 'log',
      terminal: true
    },
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
