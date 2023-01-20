/* eslint-disable @typescript-eslint/no-var-requires */
const { crossEnv } = require('nps-utils')

module.exports = {
  scripts: {
    lint: 'eslint --fix',
    start: {
      default: crossEnv('MODE=dev electron-forge start'),
      dev: crossEnv('MODE=dev electron-forge start'),
      demo: crossEnv('MODE=demo electron-forge start'),
      production: crossEnv('MODE=production electron-forge start'),
    },
    package: {
      default: crossEnv('MODE=production electron-forge package'),
      demo: crossEnv('MODE=demo electron-forge package'),
      production: crossEnv('MODE=production electron-forge package'),
    },
    build: {
      default: crossEnv('MODE=production electron-forge make'),
      demo: crossEnv('MODE=demo electron-forge make'),
      production: crossEnv('MODE=production electron-forge make'),
    },
    publish: {
      default: crossEnv(
        'MODE=production electron-forge publish --target @electron-forge/publisher-github'
      ),
      demo: crossEnv(
        'MODE=demo electron-forge publish --target @electron-forge/publisher-github'
      ),
      production: crossEnv(
        'MODE=production electron-forge publish --target @electron-forge/publisher-github'
      ),
    },
  },
}
