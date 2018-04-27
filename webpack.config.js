try {
  require('dotenv').config()
} catch (e) {
  console.log('dotenv not found, .env file ignored.')
}

const {join} = require('path')
const {EnvironmentPlugin} = require('webpack')

const {NODE_ENV} = process.env

const devtool = NODE_ENV === 'development' ? 'eval-source-map' : 'source-map'

module.exports = {
  mode: NODE_ENV || 'development',
  devtool,
  entry: {
    'account-manager': './dist/client/account-manager/index.js',
    'bundle-editor': './dist/client/bundle-editor/index.js',
    'theme.bundle': './dist/client/theme.bundle.js',
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, './dist/public')
  },
  plugins: [
    new EnvironmentPlugin([
      'APP_PROXY_PATH',
      'NODE_ENV',
    ])
  ]
}