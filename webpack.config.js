const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const ESlintPlugin = require("eslint-webpack-plugin");

module.exports = (env) => ({
  context: path.resolve(__dirname, "./src"),
  node: {
    __filename: true,
    __dirname: true,
  },
  mode: env.development ? "development" : "production",
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "assets/js/[name].bundle.js",
    publicPath: env.development ? "/" : "https://gunzenroses.github.io/slider-plugin/",
  },
  devServer: env.production ? null : { 
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    compress: true,
    hot: true,
    port: 8081,
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets/"),
      mvp: path.resolve(__dirname, "src/components/mvp/"),
      panel: path.resolve(__dirname, "src/components/panel/"),
      subview: path.resolve(__dirname, "src/components/subview/"),
      helpers: path.resolve(__dirname, "src/scripts/helpers/"),
      utils: path.resolve(__dirname, "src/scripts/utils/"),
    },
    extensions: [".ts", ".tsx", ".js", ".scss"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  devtool: env.development ? "inline-source-map" : false,
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
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
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: env.development ? "tsconfig.json" : "tsconfig.prod.json",
            }
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          env.development ? MiniCssExtractPlugin.loader : "style-loader",
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
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          env.development ? "style-loader" : MiniCssExtractPlugin.loader,
          { 
            loader: "css-loader", 
            options: { importLoaders: 1 } 
          },
          {
            loader: 'postcss-loader',
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
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new ESLintPlugin({
    //     extensions: ["ts"]
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets/favicons", to: "assets/favicons" },
      ],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      minify: true,
      template: path.resolve(__dirname, "./src/index.pug"),
      chunks: ["main"],
      inject: "body",
    }),
  ]
});