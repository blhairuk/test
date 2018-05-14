try {
  require('dotenv').config()
} catch (e) {
  console.log('dotenv not found, .env file ignored.')
}

const webpack = require('webpack')

const env = require(`./${process.env.NODE_ENV}.config.js`)

module.exports = {
  entry: {
    'account-manager': './src/client/account-manager/index.tsx',
    'bundle-editor': './src/client/bundle-editor/index.tsx',
    'theme.bundle': './src/client/theme.bundle/index.ts',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  ...env
}