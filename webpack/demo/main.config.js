const { resolve } = require('path')
const common = require('../common/main.config')

module.exports = {
  ...common,
  entry: {
    index: resolve('./electron/demo/index.ts'),
  },
}
