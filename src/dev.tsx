import './initGlobalVariables'
import {
  AccountSettingsStorage,
  AddressBookStorage,
  IronFishManager,
} from './withDemoData'
import noop from 'lodash/noop'

if (!window.IronfishManager) {
  window.IronfishManager = IronFishManager
}
if (!window.AddressBookStorage) {
  window.AddressBookStorage = AddressBookStorage
}
if (!window.AccountSettingsStorage) {
  window.AccountSettingsStorage = AccountSettingsStorage
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
