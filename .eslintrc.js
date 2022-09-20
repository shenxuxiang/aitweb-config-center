module.exports = {
  extends: [
    "alloy",
    "alloy/react",
    "alloy/typescript",
  ],
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
  },
  settings: {
    react: {
      version: "999.999.999"
    }
  },
  rules: {
    "radix": [0],
    "max-params": [0],
    "no-return-assign": [1],
    "no-undef": [1],
    "react/no-children-prop": [0],
    "@typescript-eslint/no-useless-constructor": [1],
    "@typescript-eslint/explicit-member-accessibility": [0],
    "@typescript-eslint/prefer-for-of": [0],
  }
}
