const path = require('path'),
      config = require('config'),
      webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
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
  resolve: {
    alias: {
      lib: path.join(__dirname, '..', 'lib'),
      specs: path.join(__dirname, '..', 'specs')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      API_ENDPOINT: JSON.stringify(config.get('api.endpoint'))
    }),
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    port: 3000
  }
};
