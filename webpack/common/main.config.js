/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: resolve('./electron/prod/index.ts'),
    worker: resolve(
      './node_modules/@ironfish/sdk/build/src/workerPool/worker.js'
    ),
  },
  output: {
    filename: '[name].js',
  },
  // Put your normal webpack config below here
  module: {
    rules: require('./rules'),
  },
  externals: {
    '@ironfish/sdk': '@ironfish/sdk',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve('./electron/app.ico'),
          to: resolve('./.webpack/main/app.ico'),
        },
      ],
    }),
  ],
  resolve: {
    fallback: {
      stream: false,
    },
    alias: {
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
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
}
