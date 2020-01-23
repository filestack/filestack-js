module.exports = {
  name: 'filestack-js',
  collectCoverage: true,
  clearMocks: true,
  projects: [
  {
    displayName: 'Common',
    clearMocks: true,
    testMatch: ['<rootDir>/build/main/**/*.spec.js', '<rootDir>/build/main/**/*.spec.node.js'],
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
  }, {
    displayName: 'Browser',
    testMatch: ['<rootDir>/src/**/*.browser.spec.ts'],
    clearMocks: true,
    testEnvironment: 'jsdom',
    setupFiles: ['jest-localstorage-mock'],
    testMatch: [ '<rootDir>/build/main/**/*.spec.browser.js'],
    moduleFileExtensions: ['js'],
    moduleNameMapper: {
      "\(.*)\\.node": "$1.browser",
    }
  }
]
};
