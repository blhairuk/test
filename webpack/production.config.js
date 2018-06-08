const {resolve} = require('path')
const webpack = require('webpack')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin([
      'APP_PROXY_PATH',
      'NODE_ENV',
      'STRIPE_PUBLISHABLE_TOKEN',
    ]),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled' // remove to see the output
    })
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dist/public')
  }
}