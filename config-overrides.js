const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, './types'),
            to: path.join(__dirname, '../src/types'),
          },
        ],
      }),
    ],
    resolve: {
      ...config?.resolve,
      fallback: {
        ...config?.resolve?.fallback,
        stream: false,
      },
      alias: {
        Components: path.join(__dirname, './src/components'),
        Hooks: path.join(__dirname, './src/hooks'),
        Routes: path.join(__dirname, './src/routes'),
        Svgx: path.join(__dirname, './src/svgx'),
        Utils: path.join(__dirname, './src/utils'),
        Types: path.join(__dirname, './src/types'),
        Data: path.join(__dirname, './src/data'),
      },
    },
  }
}
