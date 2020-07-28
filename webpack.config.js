const webpack = require('webpack');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'BASE_URL': JSON.stringify(BASE_URL)
    })
  ]
};
