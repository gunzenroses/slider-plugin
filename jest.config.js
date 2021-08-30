module.exports = {
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest", //to verify types
  },
  collectCoverage: true,
  //coverageReporters: ['text'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  modulePaths: ['.'],
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  testEnvironment: "jest-environment-puppeteer",
  rootDir: '.',
  moduleNameMapper: {
    '^styles/(.*)$': '<rootDir>/src/assets/styles/$1',
    '^mvp/(.*)$': '<rootDir>/src/components/mvp/$1',
    '^panel(.*)$': '<rootDir>/src/components/panel/$1',
    '^subview/(.*)$': '<rootDir>/src/components/subview/$1',
    '^helpers/(.*)$': '<rootDir>/src/scripts/helpers/$1',
    '^utils/(.*)$': '<rootDir>/src/scripts/utils/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
}