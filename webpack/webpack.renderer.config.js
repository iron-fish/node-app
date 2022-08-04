const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');
const { resolve } = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
      Components: path.join(__dirname, '../src/components'),
      Routes: path.join(__dirname, '../src/routes'),
      Svgx: path.join(__dirname, '../src/svgx'),
      Utils: path.join(__dirname, '../src/utils'),
      Types: path.join(__dirname, '../src/types'),
      react: resolve('./node_modules/react'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
