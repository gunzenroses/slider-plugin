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
        publicPath: "/",
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
            // {
            //     test: /\.tsx?$/,
            //     use: 'ts-loader',
            //     exclude: /node_modules/,
            // },
            // {
            //     test: /\/(ts|js)x$/,
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
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
            template: path.resolve(__dirname, "src/index.html"),
            chunks: ["main"],
            inject: "body",
        }),
    ]
});