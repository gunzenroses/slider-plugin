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
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: env.development ? 'tsconfig.json' : 'tsconfig.prod.json',
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
                ],
                exclude: /node_modules/,
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
        alias: {
            styles: path.resolve(__dirname, 'src/assets/styles/'),
            mvp: path.resolve(__dirname, 'src/components/mvp'),
            panel: path.resolve(__dirname, "src/components/panel"),
            subview: path.resolve(__dirname, "src/components/subview"),
            helpers: path.resolve(__dirname, "src/scripts/helpers"),
            utils: path.resolve(__dirname, "src/scripts/utils"),
        },
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules', 'src'],
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