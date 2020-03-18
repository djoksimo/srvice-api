module.exports = {
  env: {
    es6: true,
    node: true,
  },
  plugins: ["import"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.test.json"],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".d.ts", ".test.ts"],
    },
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  rules: {
    "no-undef": "off",
    quotes: [2, "double"],
    "no-console": "off",
    "no-trailing-spaces": "off",
    "linebreak-style": "off",
    "prefer-template": "off",
    "class-methods-use-this": "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "function-paren-newline": "off",
    "object-curly-newline": "off",
    "padded-blocks": "off",
    "global-require": "off",
    "no-return-assign": "off",
    "comma-dangle": "warn",
    "max-len": "warn",
    "no-return-await": "warn",
    "no-unused-vars": "error",
    "consistent-return": "warn",
    "no-param-reassign": "warn",
    "eol-last": "warn",
    "generator-star-spacing": "off",
    "arrow-parens": "off",
    "wrap-iife": "off",
    "no-mixed-operators": "warn",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "import/prefer-default-export": "off",
    "import/no-unresolved": "warn",
  },
};
