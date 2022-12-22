const { resolve } = require('path')
const common = require('../common/main.config')

module.exports = {
  ...common,
  entry: {
    ...common.entry,
    index: resolve('./electron/dev/index.ts'),
  },
}
