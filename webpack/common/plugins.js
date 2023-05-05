/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // new CopyPlugin({
  //   patterns: [
  //     {
  //       from: resolve('./public'),
  //       to: resolve('./.webpack/renderer'),
  //     },
  //     {
  //       from: resolve('./public/font'),
  //       to: resolve('./.webpack/renderer/wallet/font'),
  //     },
  //     {
  //       from: resolve('./public/images'),
  //       to: resolve('./.webpack/renderer/wallet/images'),
  //     },
  //   ],
  // }),
]
