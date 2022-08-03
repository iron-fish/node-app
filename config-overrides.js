const path = require('path')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    resolve: {
      ...config?.resolve,
      alias: {
        Components: path.join(__dirname, './src/components'),
        Routes: path.join(__dirname, './src/routes'),
        Svgx: path.join(__dirname, './src/svgx'),
        Utils: path.join(__dirname, '../src/utils'),
      },
    },
  }
}
