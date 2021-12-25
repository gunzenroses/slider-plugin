module.exports = {
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest", //to verify types
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/mvp/**",
    "**/Panel/**",
    "**/scripts/**",
    "!**/interfaces/**",
  ],
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
  rootDir: '.',
  moduleNameMapper: {
    '^styles/(.*)$': '<rootDir>/src/assets/styles/$1',
    '^mvp/(.*)$': '<rootDir>/src/components/mvp/$1',
    '^Panel(.*)$': '<rootDir>/src/components/Panel/$1',
    '^Interfaces/(.*)$': '<rootDir>/src/components/interfaces/$1',
    '^Helpers/(.*)$': '<rootDir>/src/scripts/helpers/$1',
    '^Utils/(.*)$': '<rootDir>/src/scripts/utils/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
}