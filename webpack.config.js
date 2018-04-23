const {join} = require('path')

const devtool = process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool,
  entry: {
    'account-manager': './src/client/account-manager',
    'bundle-editor': './src/client/bundle-editor'
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, './dist/public')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/, 
      loader: 'ts-loader'
    }]
  }
}