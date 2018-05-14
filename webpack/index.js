try {
  require('dotenv').config()
} catch (e) {
  console.log('dotenv not found, .env file ignored.')
}

const webpack = require('webpack')

const env = require(`./${process.env.NODE_ENV}.config.js`)

module.exports = {
  entry: {
    'account-manager': './dist/client/account-manager/index.js',
    'bundle-editor': './dist/client/bundle-editor/index.js',
    'theme.bundle': './dist/client/theme.bundle/index.js',
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        plugins: ['transform-runtime'],
        presets: [['env', {targets: {browsers: ['last 2 versions']}}]]
      },
      test: /\.js$/, 
    }]
  },
  ...env
}