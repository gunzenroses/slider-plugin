const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  entry: {
    "index": path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, "./build"),
    filename: "[name].min.js",
    publicPath: "https://gunzenroses.github.io/slider-plugin/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.prod.json",
            }
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", 
                  "autoprefixer"
                ],
              },
            },
          },
        ],
        exclude: [
          /node_modules/,
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: "css-loader", 
            options: { importLoaders: 1 } 
          },
          {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                      "postcss-preset-env", 
                      "autoprefixer"
                    ]
                }
            }
          },
          "sass-loader",
        ]
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets/favicons", to: "assets/favicons" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      minify: true,
      template: path.resolve(__dirname, "./src/index.pug"),
      chunks: ["index"],
      inject: "body",
    }),
  ],
})