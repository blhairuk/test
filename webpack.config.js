const {join} = require('path')

const {NODE_ENV} = process.env

const devtool = NODE_ENV === 'development' ? 'inline-source-map' : undefined

module.exports = {
  mode: NODE_ENV || 'development',
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
      exclude: /node_modules/,
      loader: 'ts-loader',
      test: /\.tsx?$/,
    }]
  }
}