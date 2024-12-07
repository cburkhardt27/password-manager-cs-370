const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: ['web', 'electron-renderer'],
    node: {
        __dirname: false, // Preserve Node.js behavior
    },

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
            exclude: [
                /node_modules/,  // Always exclude node_modules
                path.resolve(__dirname, 'db'),  // Exclude 'db' folder
                path.resolve(__dirname, 'mac_venv') // exclude mac_venv instead
                //    path.resolve(__dirname, 'win_venv'),  // Exclude 'win_venv'
            ],
            use: [{
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
            }]
        },{
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
            template: 'renderer/index.html'
        })
    ],

    optimization: {
        minimize: true,
    }
}