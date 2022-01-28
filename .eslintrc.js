module.exports = {
  env: {
    browser: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "airbnb-base",
    "plugin:fsd/all",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["SliderMaker", "./src/components/SliderMaker"],
          ["Model", "./src/components/Model"],
          ["View", "./src/components/View"],
          ["Presenter", "./src/components/Presenter"],
          ["Panel", "./src/components/Panel"],
          ["Observable", "./src/components/Observable"],
          ["assets", "./src/assets"],
          ["interfaces", "./src/components/interfaces"],
          ["helpers", "./src/scripts/helpers"],
          ["utils", "./src/scripts/utils"],
          ["scripts", "./src/scripts"],
        ],
        extensions: [".ts", ".js", ".jsx", ".json"],
      },
    },
  },
  plugins: ["@typescript-eslint", "fsd"],
  rules: {
    "linebreak-style": [
      "error",
      process.platform === "win32" ? "windows" : "unix",
    ],
    "object-curly-spacing": ["error", "always"],
    "template-curly-spacing": ["error", "always"],
    "prefer-template": ["error"],
    "comma-dangle": ["error", "never"],
    "max-len": [
      "error",
      {
        tabWidth: 2,
      },
    ],
    "import/extensions": ["error", "never"],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": ["warn", {
      "args": "none"
    }]
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true, // now **/*.test.js files' env has both es6 *and* jest
      },
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
      },
    },
  ],
};