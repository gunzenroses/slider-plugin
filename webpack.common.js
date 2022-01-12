const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  node: {
    __filename: true,
    __dirname: true,
  },
  optimization: {
    minimize: true
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets/"),
      mvp: path.resolve(__dirname, "src/components/mvp/"),
      Panel: path.resolve(__dirname, "src/components/Panel/"),
      Interfaces: path.resolve(__dirname, "src/components/interfaces/"),
      Helpers: path.resolve(__dirname, "src/scripts/helpers/"),
      Utils: path.resolve(__dirname, "src/scripts/utils/"),
      Scripts: path.resolve(__dirname, "src/scripts/"),
    },
    extensions: [".ts", ".tsx", ".js", ".scss"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: { 
          pretty: true,
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      "jQuery": "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery",
    }),
  ]
};