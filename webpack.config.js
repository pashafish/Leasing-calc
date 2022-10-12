const path = require('path');
const terserPlugin = require('terser-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: './src/components/app.jsx',
  module: {
    rules: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['@babel/env', '@babel/preset-react']
      }
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [new terserPlugin()],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './dist/js')
  }
};
