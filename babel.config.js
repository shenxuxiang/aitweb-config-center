module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false, useBuiltIns: "usage", debug: process.env.NODE_ENV === 'development', corejs: "3.24.1" }],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    [ 'babel-plugin-import', { libraryName: "antd", style: "css" } ],
    ["@babel/plugin-transform-runtime", { corejs: 3 }],
    "@babel/plugin-proposal-export-default-from",
    // 已经包含在 preset-env 中
    // "@babel/plugin-proposal-export-namespace-from",
    // 已经包含在 preset-env 中
    // "@babel/plugin-syntax-dynamic-import",
    // 已经包含在 preset-env 中
    // ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@babel/plugin-transform-typescript",
    process.env.NODE_ENV === 'development' ? "react-refresh/babel" : null,
  ].filter(Boolean)
}
