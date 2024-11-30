const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: ['web', 'electron-renderer'],

    entry: './renderer/index.js',

    output: {
        path: path.join(__dirname, 'pack'),
        filename: 'renderer.js',
        library: {
            type: 'umd',
        },
    },

    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
            }]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'renderer/index.html'
        })
    ],

    optimization: {
        minimize: true,
    }
}