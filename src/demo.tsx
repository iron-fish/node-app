import {
  AccountSettingsStorage,
  AddressBookStorage,
  IronFishManager,
  UpdateManager,
  ErrorManager,
} from './withDemoData'
import noop from 'lodash/noop'

window.IronfishManager = IronFishManager
window.AddressBookStorage = AddressBookStorage
window.AccountSettingsStorage = AccountSettingsStorage
window.UpdateManager = UpdateManager
window.ErrorManager = ErrorManager
window.subscribeOn = (type, callback) => {
  document.addEventListener(type, (e: CustomEvent) => {
    callback(e.detail)
  })
}
window.setElectronThemeMode = noop
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

import './init'
