const path = require('path');
const { CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const ESlintPlugin = require('eslint-webpack-plugin');

module.exports = (env) => ({
    context: path.resolve(__dirname, "./src"),
    node: {
        __filename: true,
        __dirname: true,
    },
    mode: env.development ? 'development' : 'production',
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'assets/js/[name].bundle.js',
        publicPath: env.development ? '/' : 'https://gunzenroses.github.io/slider-plugin/',
    },
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        open: true,
        compress: true,
        port: 8081,
    },
    devtool: env.development ? 'inline-source-map' : false,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: env.development ? 'tsconfig.json' : 'tsconfig.prod.json',
                        }
                    },
                ],
                exclude: /node_modules/,
            },
            // {
            //     test: /\.(ts|js)x$/,
            //     exclude: /node_modules/,
            //     use: [
            //         'babel-loader',
            //         'ts-loader',
            //     ]
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    "style-loader", // Creates `style` nodes from JS strings
                    "css-loader", // Translates CSS into CommonJS
                    "sass-loader", // Compiles Sass to CSS
                ]
            },
        ],
    },
    
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    plugins: [
        new CleanWebpackPlugin(),
        // new ESLintPlugin({
        //     extensions: ['ts']
        // }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            minify: true,
            template: path.resolve(__dirname, "./src/index.html"),
            chunks: ["main"],
            inject: "body",
        }),
    ]
});