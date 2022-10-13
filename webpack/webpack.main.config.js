const { resolve } = require('path')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../electron/app.ico'),
          to: path.join(__dirname, '../.webpack/main/app.ico'),
        },
      ],
    }),
  ],
  resolve: {
    fallback: {
      stream: false,
    },
    alias: {
      Components: path.join(__dirname, '../src/components'),
      Hooks: path.join(__dirname, '../src/hooks'),
      Routes: path.join(__dirname, '../src/routes'),
      Svgx: path.join(__dirname, '../src/svgx'),
      Utils: path.join(__dirname, '../src/utils'),
      Types: path.join(__dirname, '../types'),
      Data: path.join(__dirname, '../src/data'),
      react: resolve('./node_modules/react'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
}
