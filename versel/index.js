/* eslint-disable @typescript-eslint/no-var-requires */

const demo = require('../src/withDemoData')

window.IronfishManager = demo.IronFishManager
window.AddressBookStorage = demo.AddressBookStorage
window.AccountSettingsStorage = demo.AccountSettingsStorage
window.UpdateManager = demo.UpdateManager
window.ErrorManager = demo.ErrorManager
window.setElectronThemeMode = require('lodash/noop')
window.subscribeOn = (type, callback) => {
  document.addEventListener(type, e => {
    callback(e.detail)
  })
}
window.selectFolder = () => {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.webkitdirectory = true
    // input.directory = true
    input.onchange = () => resolve('some/test/path')
    input.click()
  })
}

setTimeout(() => {
  window.ErrorManager.addError(new Error('Demo error to test error handling'))
}, 30000)

require('../src/init')
