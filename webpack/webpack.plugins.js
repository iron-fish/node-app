const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({
    patterns: [
      {
        from: path.join(__dirname, '../public'),
        to: path.join(__dirname, '../.webpack/renderer'),
      },
      {
        from: path.join(__dirname, '../public/font'),
        to: path.join(__dirname, '../.webpack/renderer/wallet/font'),
      },
      {
        from: path.join(__dirname, '../public/images'),
        to: path.join(__dirname, '../.webpack/renderer/wallet/images'),
      },
    ],
  }),
]
