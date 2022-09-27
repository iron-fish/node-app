module.exports = {
  scripts: {
    lint: 'eslint --fix',
    start: 'electron-forge start',
    package: 'electron-forge package',
    build: 'electron-forge make',
    publish: {
      default: 'electron-forge publish',
      demo: 'electron-forge publish --target @electron-forge/publisher-github',
    },
  },
}
