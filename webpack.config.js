const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'public/'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};