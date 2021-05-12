//doesn't work at all
// modile.exports = {
//   transform: {
    //"^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    // "^.+\\.[t|j]sx?$": "babel-jest",
    // "^.+\\.tsx?$": "ts-jest",
//   }
// }

//work just with js, not ts
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };


module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testPathIgnorePatterns: ['/node_modules/'],
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

  // modile is not defined
  // modile.exports = {
  //   transform: {
  //     "^.+\\.[t|j]sx?$": "babel-jest"
  //   }
  // }