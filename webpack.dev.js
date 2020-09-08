const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './frontend/src/index.js',
  },
  output: {
    chunkFilename: '[id].js',
    path: path.resolve(__dirname, './frontend/static/frontend'),
    publicPath: '/static/frontend/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
