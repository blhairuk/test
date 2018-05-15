const {resolve} = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hotOnly: true,
    https: true
  },
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin([
      'APP_PROXY_PATH',
      'NODE_ENV',
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dist/public'),
    publicPath: 'https://localhost:8080/static/'
  },
}