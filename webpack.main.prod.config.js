const path = require('path')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: 'electron-main',

    entry: {
        main: './main/main.js',
        preload: './main/preload.js'
    },

    output: {
        path: path.join(__dirname, 'pack'),
        filename: '[name].js',
        library: {
            type: 'umd',
        },
    },

    optimization: {
        minimize: true,
    }
}