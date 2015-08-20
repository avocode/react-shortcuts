webpack = require 'webpack'

module.exports =
  entry: [
      'webpack-dev-server/client?http://localhost:8080'
      'webpack/hot/dev-server'
      "#{__dirname}/example/main.coffee"
  ]
  devtool: 'inline-source-map'
  debug: true
  output:
    path: "#{__dirname}/dist"
    filename: 'index.js'
  resolve:
    extensions: ['', '.coffee', '.js']
  resolveLoader:
    modulesDirectories: ['node_modules']
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
  module:
    preLoaders: [
      {
        test: /\.coffee$/
        exclude: [/node_modules/, /spec/, /playground/]
        loader: 'coffee-lint-loader'
      }
    ]
    loaders: [
      {
        test: /\.coffee$/
        loader: 'coffee'
      }
      {
        test: /\.less$/
        loader: "style-loader!css-loader!less-loader"
      }
    ]
    noParse: /\.min\.js/
  externals: [
    react: 'React'
    lodash: '_'
  ]
  coffeelint:
    configFile: './.coffeelint'
