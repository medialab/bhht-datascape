const path = require('path'),
      webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: path.join(__dirname, 'build/bundle.js')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    port: 3000
  }
};
