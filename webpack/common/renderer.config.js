/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require('./rules')
const plugins = require('./plugins')
const { resolve } = require('path')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    fallback: {
      stream: false,
    },
    alias: {
      stream: [resolve('./node_modules/stream-browserify')],
      Components: resolve('./src/components'),
      Hooks: resolve('./src/hooks'),
      Routes: resolve('./src/routes'),
      Svgx: resolve('./src/svgx'),
      Utils: resolve('./src/utils'),
      Types: resolve('./types'),
      Data: resolve('./src/data'),
      Providers: resolve('./src/providers'),
      react: resolve('./node_modules/react'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
