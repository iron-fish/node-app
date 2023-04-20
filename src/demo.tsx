import {
  AccountSettingsStorage,
  AddressBookStorage,
  IronFishManager,
  UpdateManager,
} from './withDemoData'
import noop from 'lodash/noop'

window.IronfishManager = IronFishManager
window.AddressBookStorage = AddressBookStorage
window.AccountSettingsStorage = AccountSettingsStorage
window.UpdateManager = UpdateManager
window.subscribeOnAccountCountChange = callback => {
  document.addEventListener('account-count-change', (e: CustomEvent) => {
    callback(e.detail)
  })
}
window.subscribeOnInitStatusChange = callback => {
  document.addEventListener('init-status-change', (e: CustomEvent) => {
    callback(e.detail)
  })
}
window.subscribeOnSnapshotStatusChange = callback => {
  document.addEventListener('snapshot-status-change', (e: CustomEvent) => {
    callback(e.detail)
  })
}
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
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

import './init'
