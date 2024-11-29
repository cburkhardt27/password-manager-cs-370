const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: ['web', 'electron-renderer'],

    entry: './renderer/index.js',

    output: {
        path: path.join(__dirname, 'out'),
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
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            },{
                loader: 'css-loader',
                options: { modules: false }
            }]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/renderer/index.html'
        })
    ],

    optimization: {
        minimize: true,
    }
}