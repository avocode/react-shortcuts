var webpack = require('webpack')

module.exports = {
  entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      `${__dirname}/example/main.js`
  ],
  devtool: 'inline-source-map',
  debug: true,
  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ],
    noParse: /\.min\.js/
  },
  externals: [
    {react: 'React'}
  ]
}
