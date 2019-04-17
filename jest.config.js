module.exports = {
  name: 'filestack-js',
  collectCoverage: true,
  clearMocks: true,
  projects: [{
    displayName: 'Common',
    clearMocks: true,
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
  }, {
    displayName: 'Node',
    clearMocks: true,
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['<rootDir>/src/**/*.spec.node.ts'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
  }, {
    displayName: 'Browser',
    testMatch: ['<rootDir>/src/**/*.browser.spec.ts'],
    clearMocks: true,
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.spec.browser.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
  }]
};
