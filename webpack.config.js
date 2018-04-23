const {join} = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'bundle-editor': './src/client/bundle-editor'
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, './dist/client')
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