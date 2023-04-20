/* eslint-disable @typescript-eslint/no-var-requires */

const demo = require('../src/withDemoData')

window.IronfishManager = demo.IronFishManager
window.AddressBookStorage = demo.AddressBookStorage
window.AccountSettingsStorage = demo.AccountSettingsStorage
window.UpdateManager = demo.UpdateManager
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = require('lodash/noop')
}
window.subscribeOnAccountCountChange = callback => {
  document.addEventListener('account-count-change', e => {
    callback(e.detail)
  })
}
window.subscribeOnInitStatusChange = callback => {
  document.addEventListener('init-status-change', e => {
    callback(e.detail)
  })
}
window.subscribeOnSnapshotStatusChange = callback => {
  document.addEventListener('snapshot-status-change', e => {
    callback(e.detail)
  })
}
if (!window.selectFolder) {
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
}

require('../src/init')
