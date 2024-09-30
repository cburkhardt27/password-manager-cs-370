const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // Serve static files from the "dist" directory
    compress: true,  // Enable gzip compression
    port: 4001,      // Port to serve the app on
    open: true,      // Automatically open the browser on server start
    hot: true,       // Enable Hot Module Replacement
    watchContentBase: true,  // Watch files in contentBase  
  },
};
