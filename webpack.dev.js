const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    "example": path.resolve(__dirname, "./src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "[name]/[name].js",
  },
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    compress: true,
    hot: true,
    port: 8081,
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
              configFile: "tsconfig.json",
            }
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
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
          "style-loader",
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
    new HtmlWebpackPlugin({
      filename: "index.html",
      minify: true,
      template: path.resolve(__dirname, "./src/index.pug"),
      chunks: ["example"],
      inject: "body",
    }),
  ]
})