const { resolve } = require('path')
const path = require('path')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: path.join(__dirname, '../electron/index.ts'),
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    alias: {
      Components: path.join(__dirname, '../src/components'),
      Routes: path.join(__dirname, '../src/routes'),
      Svgx: path.join(__dirname, '../src/svgx'),
      Utils: path.join(__dirname, '../src/utils'),
      react: resolve('./node_modules/react'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
}
