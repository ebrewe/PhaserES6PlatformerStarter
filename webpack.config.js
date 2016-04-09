module.exports = {
  entry: [
    './src/main.js'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
