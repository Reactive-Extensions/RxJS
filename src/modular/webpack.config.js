'use strict';

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'rx',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
