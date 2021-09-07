const path = require("path");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "production",
  entry: {
    "slider-plugin": path.resolve(__dirname, "./src/slider-plugin.js"),
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].min.js",
    publicPath: "https://gunzenroses.github.io/slider-plugin/",
  },
  externals: {
    jquery: 'jQuery',
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
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
  ],
})