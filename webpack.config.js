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
    'account-manager': ['babel-polyfill', './dist/client/account-manager/index.js'],
    'bundle-editor': ['babel-polyfill', './dist/client/bundle-editor/index.js'],
    'theme.bundle': ['babel-polyfill', './dist/client/theme.bundle.js'],
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      options: {
        presets: [['env', {targets: {browsers: ['last 2 versions']}}]]
      },
      test: /\.js$/, 
    }]
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