try {
  require('dotenv').config()
} catch (e) {
  console.log('dotenv not found, .env file ignored.')
}

const webpack = require('webpack')

const {NODE_ENV} = process.env

const env = require(`./${NODE_ENV}.config.js`)

module.exports = {
  entry: {
    'account-manager': './src/client/account-manager/index.tsx',
    'bundle-editor': './src/client/bundle-editor/index.tsx',
    'theme.bundle': './src/client/theme.bundle/index.ts',
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/, 
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: ['transform-runtime']
            .concat(NODE_ENV === 'development' && 'react-hot-loader/babel')
            .filter(a => a),
          presets: [[
            'env', {
              targets: {
                browsers: ['last 4 versions', 'ie >= 11']
              }
            }
          ]]
        }
      }, {
        loader: 'ts-loader'
      }]
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  ...env
}