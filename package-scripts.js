const { crossEnv } = require('nps-utils')

module.exports = {
  scripts: {
    lint: 'eslint --fix',
    start: crossEnv('APP_DEV=true electron-forge start'),
    package: 'electron-forge package',
    build: 'electron-forge make',
    publish: {
      default: 'electron-forge publish',
      demo: 'electron-forge publish --target @electron-forge/publisher-github',
    },
  },
}
