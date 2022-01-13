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
      SliderMaker: path.resolve(__dirname, "src/components/SliderMaker"),
      Model: path.resolve(__dirname, "src/components/Model"),
      View: path.resolve(__dirname, "src/components/View"),
      Presenter: path.resolve(__dirname, "src/components/Presenter"),
      Panel: path.resolve(__dirname, "src/components/Panel/"),
      Observable: path.resolve(__dirname, "src/components/Observable/"),
      assets: path.resolve(__dirname, "src/assets/"),
      interfaces: path.resolve(__dirname, "src/components/interfaces/"),
      helpers: path.resolve(__dirname, "src/scripts/helpers/"),
      utils: path.resolve(__dirname, "src/scripts/utils/"),
      scripts: path.resolve(__dirname, "src/scripts/"),
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