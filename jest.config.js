/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html', 'text'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/tools',
    'src/services',
    'src/middlewares'
  ],
  // globalSetup: './jestSetup.js',
  modulePathIgnorePatterns: ['dist', 'node_modules', 'coverage'],
  testMatch: ['**/?(*.)+(spec|test).(ts|tsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  },
  testTimeout: 10000
}
