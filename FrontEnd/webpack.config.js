const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',  // Use unique names for each chunk
    clean: true,  // Automatically clean the output directory before each build
  },
  mode: process.env.NODE_ENV || 'development',  // Set the mode to development or production
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // Handle both .js and .jsx files
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
      {
        test: /\.css$/,  // Add support for CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,  // Add support for image files (optional)
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Use the public/index.html as the template
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],  // Automatically resolve these extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 4001,
    open: true,
    hot: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',  // Split both dynamic and static imports
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};




