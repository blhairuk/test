const {join} = require('path')

const {NODE_ENV} = process.env

const devtool = NODE_ENV === 'development' ? 'inline-source-map' : undefined

module.exports = {
  mode: NODE_ENV || 'development',
  devtool,
  entry: {
    'account-manager': './dist/client/account-manager/index.js',
    'bundle-editor': './dist/client/bundle-editor/index.js'
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, './dist/public')
  }
}