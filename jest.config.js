module.exports = {
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest", //to verify types
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/components/**",
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
    '^SliderMaker/(.*)$': '<rootDir>/src/components/SliderMaker/$1',
    '^Model/(.*)$': '<rootDir>/src/components/Model/$1',
    '^View/(.*)$': '<rootDir>/src/components/View/$1',
    '^Presenter/(.*)$': '<rootDir>/src/components/Presenter/$1',
    '^Panel(.*)$': '<rootDir>/src/components/Panel/$1',
    '^Observable(.*)$': '<rootDir>/src/components/Observable/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^interfaces/(.*)$': '<rootDir>/src/components/interfaces/$1',
    '^helpers/(.*)$': '<rootDir>/src/scripts/helpers/$1',
    '^utils/(.*)$': '<rootDir>/src/scripts/utils/$1',
    '^scripts/(.*)$': '<rootDir>/src/scripts/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
}