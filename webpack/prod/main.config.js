const { resolve } = require('path')
const common = require('../common/main.config')

module.exports = {
  ...common,
  entry: resolve('./electron/prod/index.ts'),
}
