const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  entry: {
    "example": path.resolve(__dirname, "./src/index.js"),
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
  }
})