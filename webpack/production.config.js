const {resolve} = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/, 
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }, 'ts-loader']
    }]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'APP_PROXY_PATH',
      'NODE_ENV',
    ])
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dist/public')
  }
}