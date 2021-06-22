module.exports = {
  transform: {
    //"^.+\\.tsx?$": "ts-jest",
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  // testPathIgnorePatterns: [
  //   ['/node_modules/'],
  //   ['**/I[A-Z]*.{ts}']
  // ],
  collectCoverage: true,
  coverageReporters: ["html"],
  //setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  // "setupFiles": [
  //   "<rootDir>/test/setupTests.ts"
  // ]
}