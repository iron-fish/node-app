const path = require('path')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
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
        Types: path.join(__dirname, './types'),
        Data: path.join(__dirname, './src/data'),
      },
    },
  }
}
