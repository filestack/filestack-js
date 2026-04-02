module.exports = {
  collectCoverage: true,
  clearMocks: true,
  projects: [
  {
    displayName: 'Common',
    clearMocks: true,
    testMatch: ['<rootDir>/build/main/**/*.spec.js', '<rootDir>/build/main/**/*.spec.node.js'],
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
    transform: {
      '^.+\\.js$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }],
    },
    transformIgnorePatterns: [
      'node_modules/(?!(file-type|strtok3|token-types|uint8array-extras|@tokenizer/inflate|@borewit/text-codec)/)',
    ],
  }, {
    displayName: 'Browser',
    testMatch: ['<rootDir>/build/main/**/*.spec.browser.js'],
    clearMocks: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/build/main/jest_browser_setup.js'],
    setupFiles: ['jest-localstorage-mock'],
    moduleFileExtensions: ['js'],
    moduleNameMapper: {
      "\(.*)\\.node": "$1.browser",
    },
    transform: {
      '^.+\\.js$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }],
    },
    transformIgnorePatterns: [
      'node_modules/(?!(file-type|strtok3|token-types|uint8array-extras|@tokenizer/inflate|@borewit/text-codec)/)',
    ],
  }
]
};
